package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.database.ApplicationEntity
import app.ehrenamtskarte.backend.application.database.ApplicationEntity.Status
import app.ehrenamtskarte.backend.application.database.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.application.database.NOTE_MAX_CHARS
import app.ehrenamtskarte.backend.application.database.repos.ApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.create.Application
import app.ehrenamtskarte.backend.application.webservice.schema.view.ApplicationView
import app.ehrenamtskarte.backend.application.webservice.utils.ApplicationHandler
import app.ehrenamtskarte.backend.application.webservice.utils.getApplicantEmail
import app.ehrenamtskarte.backend.application.webservice.utils.getApplicantName
import app.ehrenamtskarte.backend.auth.getAuthContext
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.auth.service.Authorizer.mayDeleteApplicationsInRegion
import app.ehrenamtskarte.backend.auth.service.Authorizer.mayUpdateApplicationsInRegion
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.NotFoundException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidInputException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidLinkException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidNoteSizeException
import app.ehrenamtskarte.backend.mail.Mailer
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
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

        return transaction {
            val application = ApplicationEntity
                .findById(applicationId)
                ?: throw NotFoundException("Application not found")

            if (!mayDeleteApplicationsInRegion(authContext.admin, application.regionId.value)) {
                throw ForbiddenException()
            }

            ApplicationRepository.delete(applicationId, context)
        }
    }

    @GraphQLDescription("Withdraws the application")
    fun withdrawApplication(accessKey: String): Boolean =
        transaction {
            ApplicationRepository.withdrawApplication(accessKey)
        }

    @GraphQLDescription("Verifies or rejects an application verification")
    fun verifyOrRejectApplicationVerification(
        project: String,
        accessKey: String,
        verified: Boolean,
        dfe: DataFetchingEnvironment,
    ): Boolean =
        transaction {
            val application = ApplicationRepository
                .getApplicationByApplicationVerificationAccessKey(accessKey)
                ?: throw InvalidLinkException()

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
     * @return The updated [ApplicationView].
     * @throws InvalidInputException If an application with the specified id is not found
     * @throws ForbiddenException If the user is not allowed to modify this application
     */
    @GraphQLDescription("Approve an application")
    fun approveApplicationStatus(applicationId: Int, dfe: DataFetchingEnvironment): ApplicationView {
        val context = dfe.graphQlContext.context

        return transaction {
            val applicationEntity = ApplicationEntity.findById(applicationId)
                ?.let {
                    it.tryChangeStatus(Status.Approved)
                    ApplicationView.fromDbEntity(it, true)
                }
                ?: throw InvalidInputException("Application not found")

            if (
                mayUpdateApplicationsInRegion(context.getAuthContext().admin, applicationEntity.regionId)
            ) {
                applicationEntity
            } else {
                throw ForbiddenException()
            }
        }
    }

    /**
     * Rejects an application if it is in the Pending status.
     *
     * @return The updated [ApplicationView].
     * @throws InvalidInputException If an application with the specified id is not found
     * @throws ForbiddenException If the user is not allowed to modify this application
     */
    @GraphQLDescription("Reject an application")
    fun rejectApplicationStatus(
        applicationId: Int,
        rejectionMessage: String,
        dfe: DataFetchingEnvironment,
    ): ApplicationView {
        val context = dfe.graphQlContext.context
        val authContext = context.getAuthContext()

        return transaction {
            val application = ApplicationEntity.findById(applicationId)
                ?: throw InvalidInputException("Application not found")

            if (!mayUpdateApplicationsInRegion(authContext.admin, application.regionId.value)) {
                throw ForbiddenException()
            }

            if (!application.tryChangeStatus(Status.Rejected)) {
                throw InvalidInputException("Application cannot be rejected, as it has already been processed")
            }

            application.rejectionMessage = rejectionMessage

            Mailer.sendApplicationRejectedMail(
                context.backendConfiguration,
                context.backendConfiguration.getProjectConfig(authContext.project),
                application.getApplicantName(),
                application.getApplicantEmail(),
                rejectionMessage,
            )

            ApplicationView.fromDbEntity(application, true)
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

            if (!mayUpdateApplicationsInRegion(context.getAuthContext().admin, application.regionId.value)) {
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

            if (!Authorizer.maySendMailsInRegion(authContext.admin, application.regionId.value)) {
                throw ForbiddenException()
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
