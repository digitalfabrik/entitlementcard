package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.database.ApplicationEntity
import app.ehrenamtskarte.backend.application.database.NOTE_MAX_CHARS
import app.ehrenamtskarte.backend.application.database.repos.ApplicationRepository
import app.ehrenamtskarte.backend.application.database.repos.ApplicationRepository.getApplicationByApplicationVerificationAccessKey
import app.ehrenamtskarte.backend.application.webservice.schema.create.Application
import app.ehrenamtskarte.backend.application.webservice.utils.ApplicationHandler
import app.ehrenamtskarte.backend.auth.getAdministrator
import app.ehrenamtskarte.backend.auth.service.Authorizer.mayDeleteApplicationsInRegion
import app.ehrenamtskarte.backend.auth.service.Authorizer.mayUpdateApplicationsInRegion
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.NotFoundException
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
    ): DataFetcherResult<Boolean> {
        val applicationHandler = ApplicationHandler(dfe.getContext<GraphQLContext>(), application, regionId, project)
        val dataFetcherResultBuilder = DataFetcherResult.newResult<Boolean>()

        applicationHandler.validateRegion()
        val region = transaction {
            RegionsRepository.findRegionById(regionId)
        }
        val applicationConfirmationNote = takeIf {
            region.applicationConfirmationMailNoteActivated &&
                !region.applicationConfirmationMailNote.isNullOrEmpty()
        }.let { region.applicationConfirmationMailNote }
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
        val context = dfe.getContext<GraphQLContext>()
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
    ): Boolean {
        val application = transaction {
            getApplicationByApplicationVerificationAccessKey(accessKey)
        }
        return transaction {
            if (verified) {
                val context = dfe.getContext<GraphQLContext>()
                val backendConfig = context.backendConfiguration
                val projectConfig = backendConfig.projects.first { it.id == project }
                val successful = ApplicationRepository.verifyApplicationVerification(accessKey)
                Mailer.sendNotificationForVerificationMails(
                    project,
                    backendConfig,
                    projectConfig,
                    application.regionId,
                )

                successful
            } else {
                ApplicationRepository.rejectApplicationVerification(accessKey)
            }
        }
    }

    @GraphQLDescription("Updates a note of an application")
    fun updateApplicationNote(applicationId: Int, noteText: String, dfe: DataFetchingEnvironment): Boolean {
        val context = dfe.getContext<GraphQLContext>()
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
}
