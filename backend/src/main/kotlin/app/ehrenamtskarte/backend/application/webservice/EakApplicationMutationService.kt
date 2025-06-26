package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.database.ApplicationEntity
import app.ehrenamtskarte.backend.application.database.ApplicationEntity.Status
import app.ehrenamtskarte.backend.application.database.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.application.database.NOTE_MAX_CHARS
import app.ehrenamtskarte.backend.application.database.repos.ApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.create.Application
import app.ehrenamtskarte.backend.application.webservice.schema.view.ApplicationView
import app.ehrenamtskarte.backend.application.webservice.utils.ApplicationHandler
import app.ehrenamtskarte.backend.auth.getAdministrator
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.auth.service.Authorizer.mayDeleteApplicationsInRegion
import app.ehrenamtskarte.backend.auth.service.Authorizer.mayUpdateApplicationsInRegion
import app.ehrenamtskarte.backend.common.utils.findValueByName
import app.ehrenamtskarte.backend.common.utils.findValueByPath
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.NotFoundException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.ApplicationDataIncompleteException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidJsonException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidLinkException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidNoteSizeException
import app.ehrenamtskarte.backend.mail.Mailer
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.fasterxml.jackson.databind.JsonNode
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
    ): DataFetcherResult<Boolean> {
        val applicationHandler = ApplicationHandler(dfe.graphQlContext.context, application, regionId, project)
        val dataFetcherResultBuilder = DataFetcherResult.newResult<Boolean>()

        applicationHandler.validateRegion()
        val region = transaction {
            RegionsRepository.findRegionById(regionId)
        }
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
        return dataFetcherResultBuilder.data(true).build()
    }

    @GraphQLDescription("Deletes the application with specified id")
    fun deleteApplication(applicationId: Int, dfe: DataFetchingEnvironment): Boolean {
        val context = dfe.graphQlContext.context
        val admin = context.getAdministrator()

        return transaction {
            val application = ApplicationEntity
                .findById(applicationId)
                ?: throw NotFoundException("Application not found")

            if (!mayDeleteApplicationsInRegion(admin, application.regionId.value)) {
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
     * @return The updated ApplicationView.
     * @throws NotFoundException If an application with the specified accessKey is not found.
     */
    @GraphQLDescription("Approve an application")
    fun approveApplicationStatus(applicationId: Int, dfe: DataFetchingEnvironment): ApplicationView {
        dfe.graphQlContext.context.enforceSignedIn()

        return transaction {
            val applicationEntity = ApplicationEntity.findById(applicationId)
                ?.let {
                    it.tryChangeStatus(Status.Approved)
                    ApplicationView.fromDbEntity(it, true)
                }
                ?: throw NotFoundException("Application not found")

            if (
                mayUpdateApplicationsInRegion(dfe.graphQlContext.context.getAdministrator(), applicationEntity.regionId)
            ) {
                applicationEntity
            } else {
                throw ForbiddenException()
            }
        }
    }

    @GraphQLDescription("Updates a note of an application")
    fun updateApplicationNote(applicationId: Int, noteText: String, dfe: DataFetchingEnvironment): Boolean {
        val context = dfe.graphQlContext.context
        val admin = context.getAdministrator()

        return transaction {
            val application =
                ApplicationEntity.findById(applicationId) ?: throw NotFoundException("Application not found")
            if (noteText.length > NOTE_MAX_CHARS) {
                throw InvalidNoteSizeException(NOTE_MAX_CHARS)
            }

            if (!mayUpdateApplicationsInRegion(admin, application.regionId.value)) {
                throw ForbiddenException()
            }

            ApplicationRepository.updateApplicationNote(applicationId, noteText)
        }
    }

    @GraphQLDescription("Send approval mail to organisation")
    fun sendApprovalMailToOrganisation(
        project: String,
        applicationId: Int,
        applicationVerificationId: Int,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val context = dfe.graphQlContext.context

        transaction {
            val application = ApplicationEntity.findById(applicationId)
                ?: throw InvalidJsonException("Application not found")

            if (!Authorizer.maySendMailsInRegion(context.getAdministrator(), application.regionId.value)) {
                throw ForbiddenException()
            }

            val applicationVerification = ApplicationVerificationEntity.findById(applicationVerificationId)
                ?: throw InvalidJsonException("Application verification not found")

            if (applicationVerification.applicationId.value != applicationId) {
                throw InvalidJsonException("Application verification does not belong to the given application")
            }

            Mailer.sendApplicationVerificationMail(
                context.backendConfiguration,
                getApplicantName(application.parseJsonValue()),
                context.backendConfiguration.getProjectConfig(project),
                applicationVerification,
            )
        }
        return true
    }

    private fun getApplicantName(json: JsonNode): String {
        val personalData = json.findValueByPath("application", "personalData")
            ?: throw ApplicationDataIncompleteException()

        val forenames = personalData.findValueByName("forenames")
        val surname = personalData.findValueByName("surname")

        return listOfNotNull(forenames, surname).filter { it.isNotBlank() }.joinToString(" ")
    }
}
