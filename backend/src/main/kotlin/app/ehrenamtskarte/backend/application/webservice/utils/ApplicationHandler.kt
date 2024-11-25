package app.ehrenamtskarte.backend.application.webservice.utils

import app.ehrenamtskarte.backend.application.database.ApplicationEntity
import app.ehrenamtskarte.backend.application.database.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.application.database.repos.ApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.create.Application
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidFileSizeException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidFileTypeException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.MailNotSentException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.RegionNotActivatedForApplicationException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.mail.Mailer
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import graphql.execution.DataFetcherResult
import org.jetbrains.exposed.sql.transactions.transaction

class ApplicationHandler(
    private val context: GraphQLContext,
    private val application: Application,
    private val regionId: Int,
    private val project: String
) {

    fun sendApplicationMails(
        applicationEntity: ApplicationEntity,
        verificationEntities: List<ApplicationVerificationEntity>,
        dataFetcherResultBuilder: DataFetcherResult.Builder<Boolean>
    ) {
        val backendConfig = context.backendConfiguration
        val projectConfig = backendConfig.projects.first { it.id == project }

        Mailer.sendApplicationApplicantMail(
            backendConfig,
            projectConfig,
            application.personalData,
            applicationEntity.accessKey
        )

        for (applicationVerification in verificationEntities) {
            try {
                val applicantName =
                    "${application.personalData.forenames.shortText} ${application.personalData.surname.shortText}"
                Mailer.sendApplicationVerificationMail(
                    backendConfig,
                    applicantName,
                    projectConfig,
                    applicationVerification
                )
            } catch (exception: MailNotSentException) {
                dataFetcherResultBuilder.error(exception.toError())
            }
        }
        Mailer.sendNotificationForApplicationMails(project, backendConfig, projectConfig, regionId)
    }

    fun validateAttachmentTypes() {
        val allowedContentTypes = setOf("application/pdf", "image/png", "image/jpeg")
        val maxFileSizeBytes = 5 * 1000 * 1000
        if (!context.files.all { it.contentType in allowedContentTypes }) {
            throw InvalidFileTypeException()
        }
        if (!context.files.all { it.size <= maxFileSizeBytes }) {
            throw InvalidFileSizeException()
        }
    }

    fun validateRegion() {
        val region = transaction { RegionsRepository.findByIdInProject(project, regionId) }
            ?: throw RegionNotFoundException()
        if (!region.activatedForApplication) {
            throw RegionNotActivatedForApplicationException()
        }
    }

    fun saveApplication(): Pair<ApplicationEntity, List<ApplicationVerificationEntity>> {
        val (applicationEntity, verificationEntities) = transaction {
            ApplicationRepository.persistApplication(
                application.toJsonField(),
                application.extractApplicationVerifications(),
                regionId,
                context.applicationData,
                context.files
            )
        }
        return Pair(applicationEntity, verificationEntities)
    }

    fun isValidPreVerifiedApplication(): Boolean {
        val isAlreadyVerifiedIsSet =
            application.applicationDetails.blueCardEntitlement?.workAtOrganizationsEntitlement?.list?.any {
                it.isAlreadyVerified == true
            } ?: false
        if (isAlreadyVerifiedIsSet) {
            // check if api token is set and valid, if not throw unauthorized exception
            // Will be done in #1790
            throw UnauthorizedException()
        }
        return false
    }

    fun setApplicationVerificationToVerifiedToday(verificationEntities: List<ApplicationVerificationEntity>) {
        transaction {
            verificationEntities.forEach {
                ApplicationRepository.verifyApplicationVerification(it.accessKey)
            }
        }
    }
}
