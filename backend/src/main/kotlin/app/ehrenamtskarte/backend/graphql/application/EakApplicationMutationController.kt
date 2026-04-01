package app.ehrenamtskarte.backend.graphql.application

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.config.ProjectConfig
import app.ehrenamtskarte.backend.db.entities.ApplicationEntity
import app.ehrenamtskarte.backend.db.entities.ApplicationEntity.Status
import app.ehrenamtskarte.backend.db.entities.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.db.entities.ApplicationVerificationExternalSource.NONE
import app.ehrenamtskarte.backend.db.entities.ApplicationVerificationExternalSource.VEREIN360
import app.ehrenamtskarte.backend.db.entities.Applications
import app.ehrenamtskarte.backend.db.entities.NOTE_MAX_CHARS
import app.ehrenamtskarte.backend.db.entities.mayDeleteApplicationsInRegion
import app.ehrenamtskarte.backend.db.entities.maySendMailsInRegion
import app.ehrenamtskarte.backend.db.entities.mayUpdateApplicationsInRegion
import app.ehrenamtskarte.backend.db.repositories.ApplicationRepository
import app.ehrenamtskarte.backend.graphql.application.types.Application
import app.ehrenamtskarte.backend.graphql.application.types.ApplicationAdminGql
import app.ehrenamtskarte.backend.graphql.application.utils.getApplicantEmail
import app.ehrenamtskarte.backend.graphql.application.utils.getApplicantName
import app.ehrenamtskarte.backend.graphql.auth.requireAuthContext
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidApplicationStatusException
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidInputException
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidLinkException
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidNoteSizeException
import app.ehrenamtskarte.backend.graphql.exceptions.MailNotSentException
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import app.ehrenamtskarte.backend.shared.mail.Mailer
import app.ehrenamtskarte.backend.shared.mail.collectMailErrors
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import graphql.execution.DataFetcherResult
import graphql.schema.DataFetchingEnvironment
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.Part
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.ContextValue
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.stereotype.Controller
import kotlin.collections.orEmpty

@Controller
class EakApplicationMutationController(
    private val backendConfiguration: BackendConfiguration,
    private val applicationService: ApplicationService,
    private val mailService: Mailer,
) {
    @GraphQLDescription("Stores a new application for an EAK")
    @MutationMapping
    fun addEakApplication(
        @Argument regionId: Int,
        @Argument application: Application,
        @Argument project: String,
        @GraphQLIgnore @ContextValue(required = false) files: List<Part>?,
        @GraphQLIgnore @ContextValue request: HttpServletRequest,
    ): DataFetcherResult<Boolean> {
        val projectConfig = backendConfiguration.getProjectConfig(project)

        val attachments = files.orEmpty()
        applicationService.validateAttachmentTypes(attachments)
        applicationService.validateRegionActivatedForApplication(project, regionId)

        if (applicationService.isValidPreVerifiedApplication(application, request)) {
            return addPreVerifiedEakApplication(application, regionId, attachments, projectConfig)
        }

        val verifications = transaction {
            val (applicationEntity, verificationEntities) = applicationService.saveApplication(
                application,
                regionId,
                attachments,
                automaticSource = NONE,
            )
            // Send mail to applicant within the transaction to ensure rollback on failure
            mailService.sendApplicationApplicantMail(
                projectConfig,
                application.personalData,
                applicationEntity.accessKey,
                regionId,
            )
            verificationEntities
        }

        val applicantName = application.personalData.fullName()
        val errors = collectMailErrors(verifications) { verification ->
            mailService.sendApplicationVerificationMail(applicantName, projectConfig, verification)
        }
        mailService.sendNotificationForApplicationMails(projectConfig, regionId)

        return DataFetcherResult.newResult<Boolean>().data(true).errors(errors).build()
    }

    private fun addPreVerifiedEakApplication(
        application: Application,
        regionId: Int,
        attachments: List<Part>,
        projectConfig: ProjectConfig,
    ): DataFetcherResult<Boolean> {
        val (applicationEntity, verificationEntities) = transaction {
            applicationService.saveApplication(application, regionId, attachments, VEREIN360)
        }
        val errors = collectMailErrors(verificationEntities) { verification ->
            mailService.sendPreVerifiedApplicationMail(
                projectConfig,
                verification,
                application.personalData.fullName(),
                applicationEntity.accessKey,
                regionId,
            )
        }
        mailService.sendNotificationForApplicationMails(projectConfig, regionId)

        return DataFetcherResult.newResult<Boolean>().data(true).errors(errors).build()
    }

    @GraphQLDescription("Deletes the application with specified id")
    @MutationMapping
    fun deleteApplication(
        @Argument applicationId: Int,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val authContext = dfe.requireAuthContext()

        transaction {
            val application = ApplicationEntity.findById(applicationId)
                ?: throw InvalidInputException("Application not found")

            if (!authContext.admin.mayDeleteApplicationsInRegion(application.regionId.value)) {
                throw ForbiddenException()
            }

            if (application.status == Status.Pending) {
                throw InvalidInputException("Application cannot be deleted while it is in a pending state")
            }

            applicationService.deleteApplication(authContext.project, application)
        }
        return true
    }

    @GraphQLDescription("Withdraws the application")
    @MutationMapping
    fun withdrawApplication(
        @Argument accessKey: String,
    ): Boolean =
        transaction {
            val application = ApplicationEntity.find { Applications.accessKey eq accessKey }
                .singleOrNull() ?: throw InvalidLinkException()
            if (application.status != Status.Pending) {
                throw InvalidApplicationStatusException()
            } else {
                application.status = Status.Withdrawn
                true
            }
        }

    @GraphQLDescription("Verifies or rejects an application verification")
    @MutationMapping
    fun verifyOrRejectApplicationVerification(
        @Argument project: String,
        @Argument accessKey: String,
        @Argument verified: Boolean,
    ): Boolean =
        transaction {
            val application = ApplicationRepository.getApplicationByApplicationVerificationAccessKey(accessKey)
                ?: throw InvalidLinkException()

            if (application.status == Status.Withdrawn) {
                throw InvalidInputException("Application is withdrawn")
            }

            if (verified) {
                val projectConfig = backendConfiguration.getProjectConfig(project)

                ApplicationRepository.verifyApplicationVerification(accessKey).also {
                    mailService.sendNotificationForVerificationMails(
                        projectConfig,
                        application.regionId.value,
                    )
                }
            } else {
                ApplicationRepository.rejectApplicationVerification(accessKey)
            }
        }

    /**
     * Approves an application if it is in the Pending status.
     *
     * @return The updated [ApplicationAdminGql].
     * @throws InvalidInputException If an application with the specified id is not found
     * @throws ForbiddenException If the user is not allowed to modify this application
     */
    @GraphQLDescription("Approve an application")
    @MutationMapping
    fun approveApplicationStatus(
        @Argument applicationId: Int,
        dfe: DataFetchingEnvironment,
    ): ApplicationAdminGql =
        transaction {
            val applicationEntity = ApplicationEntity.findById(applicationId)
                ?: throw InvalidInputException("Application not found")

            applicationEntity.changeStatusOrThrow(Status.Approved)

            if (dfe.requireAuthContext().admin.mayUpdateApplicationsInRegion(applicationEntity.regionId.value)) {
                ApplicationAdminGql.fromDbEntity(applicationEntity)
            } else {
                throw ForbiddenException()
            }
        }

    /**
     * Rejects an application if it is in the Pending status.
     *
     * @return The updated [ApplicationAdminGql].
     * @throws InvalidInputException If an application with the specified id is not found
     * @throws ForbiddenException If the user is not allowed to modify this application
     */
    @GraphQLDescription("Reject an application")
    @MutationMapping
    fun rejectApplicationStatus(
        @Argument applicationId: Int,
        @Argument rejectionMessage: String,
        dfe: DataFetchingEnvironment,
    ): DataFetcherResult<ApplicationAdminGql> {
        val authContext = dfe.requireAuthContext()

        return transaction {
            val application = ApplicationEntity.findById(applicationId)
                ?: throw InvalidInputException("Application not found")

            if (!authContext.admin.mayUpdateApplicationsInRegion(application.regionId.value)) {
                throw ForbiddenException()
            }

            application.changeStatusOrThrow(Status.Rejected)
            application.rejectionMessage = rejectionMessage

            val resultBuilder = DataFetcherResult.newResult<ApplicationAdminGql>()
            try {
                mailService.sendApplicationRejectedMail(
                    backendConfiguration.getProjectConfig(authContext.project),
                    application.getApplicantName(),
                    application.getApplicantEmail(),
                    rejectionMessage,
                )
            } catch (e: MailNotSentException) {
                resultBuilder.error(e.toGraphQLError())
            }
            resultBuilder.data(ApplicationAdminGql.fromDbEntity(application)).build()
        }
    }

    @GraphQLDescription("Updates a note of an application")
    @MutationMapping
    fun updateApplicationNote(
        @Argument applicationId: Int,
        @Argument noteText: String,
        dfe: DataFetchingEnvironment,
    ): Boolean =
        transaction {
            val application =
                ApplicationEntity.findById(applicationId) ?: throw InvalidInputException("Application not found")
            if (noteText.length > NOTE_MAX_CHARS) {
                throw InvalidNoteSizeException(NOTE_MAX_CHARS)
            }

            if (!dfe.requireAuthContext().admin.mayUpdateApplicationsInRegion(application.regionId.value)) {
                throw ForbiddenException()
            }

            ApplicationRepository.updateApplicationNote(applicationId, noteText)
        }

    @GraphQLDescription("Send approval mail to organisation")
    @MutationMapping
    fun sendApprovalMailToOrganisation(
        @Argument applicationId: Int,
        @Argument applicationVerificationId: Int,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val authContext = dfe.requireAuthContext()

        transaction {
            val application = ApplicationEntity.findById(applicationId)
                ?: throw InvalidInputException("Application not found")

            if (!authContext.admin.maySendMailsInRegion(application.regionId.value)) {
                throw ForbiddenException()
            }

            if (application.status == Status.Withdrawn) {
                throw InvalidInputException("Application is withdrawn")
            }

            val applicationVerification = ApplicationVerificationEntity.findById(applicationVerificationId)
                ?: throw InvalidInputException("Application verification not found")

            if (applicationVerification.applicationId.value != applicationId) {
                throw InvalidInputException("Application verification does not belong to the given application")
            }

            mailService.sendApplicationVerificationMail(
                application.getApplicantName(),
                backendConfiguration.getProjectConfig(authContext.project),
                applicationVerification,
            )
        }
        return true
    }
}

private fun ApplicationEntity.changeStatusOrThrow(status: Status): ApplicationEntity =
    try {
        this.status = status
        this
    } catch (e: IllegalArgumentException) {
        throw InvalidInputException("Cannot set application to '$status', is '${this.status}'")
    }
