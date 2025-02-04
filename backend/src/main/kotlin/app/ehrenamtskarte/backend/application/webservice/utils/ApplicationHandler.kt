package app.ehrenamtskarte.backend.application.webservice.utils

import app.ehrenamtskarte.backend.application.database.ApplicationEntity
import app.ehrenamtskarte.backend.application.database.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.application.database.ApplicationVerificationExternalSource
import app.ehrenamtskarte.backend.application.database.repos.ApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.create.Application
import app.ehrenamtskarte.backend.application.webservice.schema.create.ApplicationType
import app.ehrenamtskarte.backend.application.webservice.schema.create.BavariaCardType
import app.ehrenamtskarte.backend.application.webservice.schema.create.BlueCardEntitlementType
import app.ehrenamtskarte.backend.auth.database.ApiTokenType
import app.ehrenamtskarte.backend.auth.webservice.TokenAuthenticator
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidFileSizeException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidFileTypeException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidJsonException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.MailNotSentException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.RegionNotActivatedForApplicationException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.mail.Mailer
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import graphql.execution.DataFetcherResult
import io.javalin.http.BadRequestResponse
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

    fun sendPreVerifiedApplicationMails(
        applicationEntity: ApplicationEntity,
        verificationEntities: List<ApplicationVerificationEntity>,
        dataFetcherResultBuilder: DataFetcherResult.Builder<Boolean>
    ) {
        val backendConfig = context.backendConfiguration
        val projectConfig = backendConfig.projects.first { it.id == project }

        for (applicationVerification in verificationEntities) {
            try {
                Mailer.sendApplicationMailToContactPerson(
                    backendConfig,
                    projectConfig,
                    applicationVerification.contactName,
                    application.personalData,
                    applicationEntity.accessKey
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
        val isAlreadyVerifiedList =
            application.applicationDetails.blueCardEntitlement?.workAtOrganizationsEntitlement?.list?.map { it.isAlreadyVerified }
                ?: emptyList()
        val allAlreadyVerifiedWithToken = when {
            isAlreadyVerifiedList.all { it == false || it == null } -> false
            isAlreadyVerifiedList.all { it == true } -> {
                TokenAuthenticator.authenticate(context.request, ApiTokenType.VERIFIED_APPLICATION)
                true
            }

            else -> throw BadRequestResponse("isAlreadyVerified must be the same for all entries")
        }
        if (!allAlreadyVerifiedWithToken) return false
        validateAllAttributesForPreVerifiedApplication()
        return true
    }

    private fun validateAllAttributesForPreVerifiedApplication() {
        try {
            val applicationDetails = application.applicationDetails

            require(applicationDetails.applicationType == ApplicationType.FIRST_APPLICATION) {
                "Application type must be FIRST_APPLICATION if application is already verified"
            }
            require(applicationDetails.cardType == BavariaCardType.BLUE) {
                "Card type must be BLUE if application is already verified"
            }
            require(applicationDetails.wantsDigitalCard) {
                "Digital card must be true if application is already verified"
            }
            require(!applicationDetails.wantsPhysicalCard) {
                "Physical card must be false if application is already verified"
            }
            val blueCardEntitlement = applicationDetails.blueCardEntitlement
                ?: throw InvalidJsonException("Blue card entitlement must be set if application is already verified")

            val workAtOrganizationsEntitlement = blueCardEntitlement.workAtOrganizationsEntitlement
                ?: throw InvalidJsonException("Work at organizations entitlement must be set if application is already verified")

            require(blueCardEntitlement.entitlementType == BlueCardEntitlementType.WORK_AT_ORGANIZATIONS) {
                "Entitlement type must be WORK_AT_ORGANIZATIONS if application is already verified"
            }

            val organizations = workAtOrganizationsEntitlement.list
            require(organizations.isNotEmpty()) {
                "Work at organizations list cannot be empty if application is already verified"
            }
            require(organizations.all { it.organization.category.shortText == "Sport" }) {
                "All organizations must be of category Sport if application is already verified"
            }
        } catch (e: IllegalArgumentException) {
            throw InvalidJsonException(e.message!!)
        }
    }

    fun setApplicationVerificationToPreVerifiedNow(verificationEntities: List<ApplicationVerificationEntity>) {
        transaction {
            verificationEntities.forEach {
                ApplicationRepository.verifyApplicationVerification(
                    it.accessKey,
                    ApplicationVerificationExternalSource.VEREIN360
                )
            }
        }
    }
}
