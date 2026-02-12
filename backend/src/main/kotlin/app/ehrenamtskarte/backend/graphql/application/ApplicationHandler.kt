package app.ehrenamtskarte.backend.graphql.application

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.db.entities.ApiTokenType
import app.ehrenamtskarte.backend.db.entities.ApplicationEntity
import app.ehrenamtskarte.backend.db.entities.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.db.entities.ApplicationVerificationExternalSource
import app.ehrenamtskarte.backend.db.repositories.ApplicationRepository
import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.graphql.application.types.Application
import app.ehrenamtskarte.backend.graphql.application.types.ApplicationType
import app.ehrenamtskarte.backend.graphql.application.types.BavariaCardType
import app.ehrenamtskarte.backend.graphql.application.types.BlueCardEntitlementType
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidFileSizeException
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidFileTypeException
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidInputException
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidJsonException
import app.ehrenamtskarte.backend.graphql.exceptions.MailNotSentException
import app.ehrenamtskarte.backend.graphql.exceptions.RegionNotActivatedForApplicationException
import app.ehrenamtskarte.backend.graphql.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.shared.TokenAuthenticator
import app.ehrenamtskarte.backend.shared.mail.Mailer
import graphql.execution.DataFetcherResult
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.Part
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import java.io.File

class ApplicationHandler(
    private val backendConfig: BackendConfiguration,
    private val application: Application,
    private val regionId: Int,
    private val project: String,
    private val applicationData: File,
    private val files: List<Part>,
    private val request: HttpServletRequest,
) {
    fun sendApplicationMails(
        applicationEntity: ApplicationEntity,
        verificationEntities: List<ApplicationVerificationEntity>,
        dataFetcherResultBuilder: DataFetcherResult.Builder<Boolean>,
        applicationConfirmationNote: String?,
    ) {
        val projectConfig = backendConfig.projects.first { it.id == project }

        Mailer.sendApplicationApplicantMail(
            backendConfig,
            projectConfig,
            application.personalData,
            applicationEntity.accessKey,
            applicationConfirmationNote,
        )

        for (applicationVerification in verificationEntities) {
            try {
                val applicantName =
                    "${application.personalData.forenames.shortText} ${application.personalData.surname.shortText}"
                Mailer.sendApplicationVerificationMail(
                    backendConfig,
                    applicantName,
                    projectConfig,
                    applicationVerification,
                )
            } catch (exception: MailNotSentException) {
                dataFetcherResultBuilder.error(exception.toGraphQLError())
            }
        }
        Mailer.sendNotificationForApplicationMails(project, backendConfig, projectConfig, regionId)
    }

    fun sendPreVerifiedApplicationMails(
        applicationEntity: ApplicationEntity,
        verificationEntities: List<ApplicationVerificationEntity>,
        dataFetcherResultBuilder: DataFetcherResult.Builder<Boolean>,
        applicationConfirmationNote: String?,
    ) {
        val projectConfig = backendConfig.projects.first { it.id == project }

        for (applicationVerification in verificationEntities) {
            try {
                Mailer.sendApplicationMailToContactPerson(
                    backendConfig,
                    projectConfig,
                    applicationVerification.contactName,
                    applicationVerification.contactEmailAddress,
                    application.personalData,
                    applicationEntity.accessKey,
                    applicationConfirmationNote,
                )
            } catch (exception: MailNotSentException) {
                dataFetcherResultBuilder.error(exception.toGraphQLError())
            }
        }
        Mailer.sendNotificationForApplicationMails(project, backendConfig, projectConfig, regionId)
    }

    fun validateAttachmentTypes() {
        val allowedContentTypes = setOf("application/pdf", "image/png", "image/jpeg")
        val maxFileSizeBytes = 5 * 1000 * 1000
        if (!files.all { it.contentType in allowedContentTypes }) {
            throw InvalidFileTypeException()
        }
        if (!files.all { it.size <= maxFileSizeBytes }) {
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
                applicationData,
                files,
            )
        }
        return Pair(applicationEntity, verificationEntities)
    }

    fun isValidPreVerifiedApplication(): Boolean {
        val isAlreadyVerifiedList =
            application.applicationDetails.blueCardEntitlement?.workAtOrganizationsEntitlement?.list
                ?.map { it.isAlreadyVerified }
                ?: emptyList()
        val allAlreadyVerifiedWithToken = when {
            isAlreadyVerifiedList.all { it == false || it == null } -> false
            isAlreadyVerifiedList.all { it == true } -> {
                TokenAuthenticator.authenticate(request, ApiTokenType.VERIFIED_APPLICATION)
                true
            }
            else -> throw InvalidInputException("isAlreadyVerified must be the same for all entries")
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
                ?: throw InvalidJsonException(
                    "Work at organizations entitlement must be set if application is already verified",
                )

            require(
                blueCardEntitlement.entitlementType == BlueCardEntitlementType.WORK_AT_ORGANIZATIONS,
            ) {
                "Entitlement type must be WORK_AT_ORGANIZATIONS if application is already verified"
            }

            val organizations = workAtOrganizationsEntitlement.list
            require(organizations.isNotEmpty()) {
                "Work at organizations list cannot be empty if application is already verified"
            }
            require(organizations.all { it.organization.category.shortText == "sports" }) {
                "All organizations must be of category 'sports' if application is already verified"
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
                    ApplicationVerificationExternalSource.VEREIN360,
                )
            }
        }
    }
}
