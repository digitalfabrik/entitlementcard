package app.ehrenamtskarte.backend.regions.webservice.schema

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidApplicationConfirmationNoteSizeException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidDataPolicySizeException
import app.ehrenamtskarte.backend.regions.database.APPLICATION_CONFIRMATION_MAIL_NOTE_MAX_CHARS
import app.ehrenamtskarte.backend.regions.database.PRIVACY_POLICY_MAX_CHARS
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class RegionsMutationService {
    @GraphQLDescription("Updates the data privacy policy of a region")
    fun updateDataPrivacy(dfe: DataFetchingEnvironment, regionId: Int, dataPrivacyText: String): Boolean {
        val jwtPayload = dfe.graphQlContext.context.enforceSignedIn()
        transaction {
            val user = AdministratorEntity.findById(jwtPayload.adminId) ?: throw UnauthorizedException()
            if (dataPrivacyText.length > PRIVACY_POLICY_MAX_CHARS) {
                throw InvalidDataPolicySizeException(PRIVACY_POLICY_MAX_CHARS)
            }
            if (!Authorizer.mayUpdateSettingsInRegion(user, regionId)) {
                throw ForbiddenException()
            }
            val region = RegionsRepository.findRegionById(regionId)
            RegionsRepository.updateDataPolicy(region, dataPrivacyText)
        }
        return true
    }

    @GraphQLDescription("Updates the region specific settings")
    fun updateRegionSettings(
        dfe: DataFetchingEnvironment,
        regionId: Int,
        activatedForApplication: Boolean,
        activatedForConfirmationMail: Boolean,
    ): Boolean {
        val jwtPayload = dfe.graphQlContext.context.enforceSignedIn()
        transaction {
            val user = AdministratorEntity.findById(jwtPayload.adminId) ?: throw UnauthorizedException()
            if (!Authorizer.mayUpdateSettingsInRegion(user, regionId)) {
                throw ForbiddenException()
            }
            val region = RegionsRepository.findRegionById(regionId)
            RegionsRepository.updateRegionSettings(
                region,
                activatedForApplication,
                activatedForConfirmationMail,
            )
        }
        return true
    }

    @GraphQLDescription("Updates application confirmation mail note")
    fun updateApplicationConfirmationNote(
        dfe: DataFetchingEnvironment,
        regionId: Int,
        applicationConfirmationNote: String,
        applicationConfirmationNoteActivated: Boolean,
    ): Boolean {
        val jwtPayload = dfe.graphQlContext.context.enforceSignedIn()
        transaction {
            val user = AdministratorEntity.findById(jwtPayload.adminId) ?: throw UnauthorizedException()
            if (applicationConfirmationNote.length > APPLICATION_CONFIRMATION_MAIL_NOTE_MAX_CHARS) {
                throw InvalidApplicationConfirmationNoteSizeException(APPLICATION_CONFIRMATION_MAIL_NOTE_MAX_CHARS)
            }
            if (!Authorizer.mayUpdateSettingsInRegion(user, regionId)) {
                throw ForbiddenException()
            }
            val region = RegionsRepository.findRegionById(regionId)
            RegionsRepository.updateApplicationConfirmationNote(
                region,
                applicationConfirmationNote,
                applicationConfirmationNoteActivated,
            )
        }
        return true
    }
}
