package app.ehrenamtskarte.backend.graphql.application

import app.ehrenamtskarte.backend.db.entities.ApiTokenType
import app.ehrenamtskarte.backend.db.entities.ApplicationEntity
import app.ehrenamtskarte.backend.db.entities.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.db.entities.ApplicationVerifications
import app.ehrenamtskarte.backend.db.repositories.ApplicationRepository
import app.ehrenamtskarte.backend.graphql.application.types.Application
import app.ehrenamtskarte.backend.graphql.application.types.ApplicationType
import app.ehrenamtskarte.backend.graphql.application.types.BavariaCardType
import app.ehrenamtskarte.backend.graphql.application.types.BlueCardEntitlementType
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidInputException
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidJsonException
import app.ehrenamtskarte.backend.shared.TokenAuthenticator
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.Part
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.deleteWhere
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.springframework.stereotype.Service
import java.io.File
import java.nio.file.Paths

@Service
class ApplicationService(
    private val applicationData: File,
) {
    fun saveApplication(
        application: Application,
        regionId: Int,
        files: List<Part>,
    ): Pair<ApplicationEntity, List<ApplicationVerificationEntity>> {
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

    fun deleteApplication(project: String, application: ApplicationEntity) {
        ApplicationVerifications.deleteWhere { ApplicationVerifications.applicationId eq application.id }
        application.delete()

        val applicationDirectory = Paths.get(
            applicationData.absolutePath,
            project,
            application.id.toString(),
        ).toFile()

        if (applicationDirectory.exists()) {
            applicationDirectory.deleteRecursively()
        }
    }

    fun isValidPreVerifiedApplication(application: Application, request: HttpServletRequest): Boolean {
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
        validateAllAttributesForPreVerifiedApplication(application)
        return true
    }

    private fun validateAllAttributesForPreVerifiedApplication(application: Application) {
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
}
