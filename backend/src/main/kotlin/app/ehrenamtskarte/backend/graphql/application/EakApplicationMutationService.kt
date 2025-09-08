package app.ehrenamtskarte.backend.graphql.application

import app.ehrenamtskarte.backend.db.entities.ApplicationEntity
import app.ehrenamtskarte.backend.db.entities.ApplicationEntity.Status
import app.ehrenamtskarte.backend.db.entities.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.db.entities.Applications
import app.ehrenamtskarte.backend.db.entities.NOTE_MAX_CHARS
import app.ehrenamtskarte.backend.db.entities.mayDeleteApplicationsInRegion
import app.ehrenamtskarte.backend.db.entities.maySendMailsInRegion
import app.ehrenamtskarte.backend.db.entities.mayUpdateApplicationsInRegion
import app.ehrenamtskarte.backend.db.repositories.ApplicationRepository
import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.NotFoundException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidInputException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidLinkException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidNoteSizeException
import app.ehrenamtskarte.backend.graphql.application.schema.create.Application
import app.ehrenamtskarte.backend.graphql.application.schema.view.ApplicationAdminGql
import app.ehrenamtskarte.backend.graphql.application.utils.ApplicationHandler
import app.ehrenamtskarte.backend.graphql.application.utils.getApplicantEmail
import app.ehrenamtskarte.backend.graphql.application.utils.getApplicantName
import app.ehrenamtskarte.backend.graphql.getAuthContext
import app.ehrenamtskarte.backend.mail.Mailer
import app.ehrenamtskarte.backend.graphql.shared.context
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.execution.DataFetcherResult
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class EakApplicationMutationService {
    @GraphQLDescription("Stores a new application for an EAK")
    fun addEakApplication(
        regionId: Int,
        application: Application,
        project: String,
        dfe: DataFetchingEnvironment,
    ): DataFetcherResult<Boolean> =
        transaction {
            val applicationHandler = ApplicationHandler(dfe.graphQlContext.context, application, regionId, project)
            val dataFetcherResultBuilder = DataFetcherResult.newResult<Boolean>()

            applicationHandler.validateRegion()

            val region = RegionsRepository.findRegionById(regionId)
            val applicationConfirmationNote = region.applicationConfirmationMailNote
                ?.takeIf { region.applicationConfirmationMailNoteActivated && it.isNotEmpty() }
            applicationHandler.validateAttachmentTypes()
            val isPreVerified = applicationHandler.isValidPreVerifiedApplication()

            val (applicationEntity, verificationEntities) = applicationHandler.saveApplication()

            if (isPreVerified) {
                applicationHandler.setApplicationVerificationToPreVerifiedNow(verificationEntities)
                applicationHandler.sendPreVerifiedApplicationMails(
                    applicationEntity,
                    verificationEntities,
                    dataFetcherResultBuilder,
                    applicationConfirmationNote,
                )
            } else {
                applicationHandler.sendApplicationMails(
                    applicationEntity,
                    verificationEntities,
                    dataFetcherResultBuilder,
                    applicationConfirmationNote,
                )
            }
            return@transaction dataFetcherResultBuilder.data(true).build()
        }

    @GraphQLDescription("Deletes the application with specified id")
    fun deleteApplication(applicationId: Int, dfe: DataFetchingEnvironment): Boolean {
        val context = dfe.graphQlContext.context
        val authContext = context.getAuthContext()

        transaction {
            val application = ApplicationEntity.findById(applicationId)
                ?: throw InvalidInputException("Application not found")

            if (!authContext.admin.mayDeleteApplicationsInRegion(application.regionId.value)) {
                throw ForbiddenException()
            }

            if (application.status == Status.Pending) {
                throw InvalidInputException("Application cannot be deleted while it is in a pending state")
            }

            ApplicationRepository.delete(authContext.project, application, context)
        }
        return true
    }

    @GraphQLDescription("Withdraws the application")
    fun withdrawApplication(accessKey: String): Boolean =
        transaction {
            try {
                ApplicationEntity.find { Applications.accessKey eq accessKey }.single().status = Status.Withdrawn
                true
            } catch (e: IllegalArgumentException) {
                false
            }
        }

    @GraphQLDescription("Verifies or rejects an application verification")
    fun verifyOrRejectApplicationVerification(
        project: String,
        accessKey: String,
        verified: Boolean,
        dfe: DataFetchingEnvironment,
    ): Boolean =
        transaction {
            val application = ApplicationRepository.getApplicationByApplicationVerificationAccessKey(accessKey)
                ?: throw InvalidLinkException()

            if (application.status == Status.Withdrawn) {
                throw InvalidInputException("Application is withdrawn")
            }

            if (verified) {
                val context = dfe.graphQlContext.context
                val backendConfig = context.backendConfiguration
                val projectConfig = backendConfig.projects.first { it.id == project }

                ApplicationRepository.verifyApplicationVerification(accessKey).also {
                    Mailer.sendNotificationForVerificationMails(
                        project,
                        backendConfig,
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
    fun approveApplicationStatus(applicationId: Int, dfe: DataFetchingEnvironment): ApplicationAdminGql {
        val context = dfe.graphQlContext.context

        return transaction {
            val applicationEntity = ApplicationEntity.findById(applicationId)
                ?: throw InvalidInputException("Application not found")

            applicationEntity.changeStatusOrThrow(Status.Approved)

            if (context.getAuthContext().admin.mayUpdateApplicationsInRegion(applicationEntity.regionId.value)) {
                ApplicationAdminGql.fromDbEntity(applicationEntity)
            } else {
                throw ForbiddenException()
            }
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
    fun rejectApplicationStatus(
        applicationId: Int,
        rejectionMessage: String,
        dfe: DataFetchingEnvironment,
    ): ApplicationAdminGql {
        val context = dfe.graphQlContext.context
        val authContext = context.getAuthContext()

        return transaction {
            val application = ApplicationEntity.findById(applicationId)
                ?: throw InvalidInputException("Application not found")

            if (!authContext.admin.mayUpdateApplicationsInRegion(application.regionId.value)) {
                throw ForbiddenException()
            }

            application.changeStatusOrThrow(Status.Rejected)
            application.rejectionMessage = rejectionMessage

            Mailer.sendApplicationRejectedMail(
                context.backendConfiguration,
                context.backendConfiguration.getProjectConfig(authContext.project),
                application.getApplicantName(),
                application.getApplicantEmail(),
                rejectionMessage,
            )

            ApplicationAdminGql.fromDbEntity(application)
        }
    }

    @GraphQLDescription("Updates a note of an application")
    fun updateApplicationNote(applicationId: Int, noteText: String, dfe: DataFetchingEnvironment): Boolean {
        val context = dfe.graphQlContext.context

        return transaction {
            val application =
                ApplicationEntity.findById(applicationId) ?: throw NotFoundException("Application not found")
            if (noteText.length > NOTE_MAX_CHARS) {
                throw InvalidNoteSizeException(NOTE_MAX_CHARS)
            }

            if (!context.getAuthContext().admin.mayUpdateApplicationsInRegion(application.regionId.value)) {
                throw ForbiddenException()
            }

            ApplicationRepository.updateApplicationNote(applicationId, noteText)
        }
    }

    @GraphQLDescription("Send approval mail to organisation")
    fun sendApprovalMailToOrganisation(
        applicationId: Int,
        applicationVerificationId: Int,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val context = dfe.graphQlContext.context
        val authContext = context.getAuthContext()

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

            Mailer.sendApplicationVerificationMail(
                context.backendConfiguration,
                application.getApplicantName(),
                context.backendConfiguration.getProjectConfig(authContext.project),
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
