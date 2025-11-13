package app.ehrenamtskarte.backend.graphql.regions

import app.ehrenamtskarte.backend.db.entities.APPLICATION_CONFIRMATION_MAIL_NOTE_MAX_CHARS
import app.ehrenamtskarte.backend.db.entities.PRIVACY_POLICY_MAX_CHARS
import app.ehrenamtskarte.backend.db.entities.mayUpdateSettingsInRegion
import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.graphql.auth.requireAuthContext
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidApplicationConfirmationNoteSizeException
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidDataPolicySizeException
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.stereotype.Controller

@Controller
class RegionMutationController {
    @GraphQLDescription("Updates the data privacy policy of a region")
    @MutationMapping
    fun updateDataPrivacy(
        dfe: DataFetchingEnvironment,
        @Argument regionId: Int,
        @Argument dataPrivacyText: String,
    ): Boolean {
        val admin = dfe.requireAuthContext().admin
        transaction {
            if (dataPrivacyText.length > PRIVACY_POLICY_MAX_CHARS) {
                throw InvalidDataPolicySizeException(PRIVACY_POLICY_MAX_CHARS)
            }
            if (!admin.mayUpdateSettingsInRegion(regionId)) {
                throw ForbiddenException()
            }
            val region = RegionsRepository.findRegionById(regionId)
            RegionsRepository.updateDataPolicy(region, dataPrivacyText)
        }
        return true
    }

    @GraphQLDescription("Updates the region specific settings")
    @MutationMapping
    fun updateRegionSettings(
        dfe: DataFetchingEnvironment,
        @Argument regionId: Int,
        @Argument activatedForApplication: Boolean,
        @Argument activatedForConfirmationMail: Boolean,
    ): Boolean {
        val admin = dfe.requireAuthContext().admin
        transaction {
            if (!admin.mayUpdateSettingsInRegion(regionId)) {
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
    @MutationMapping
    fun updateApplicationConfirmationNote(
        dfe: DataFetchingEnvironment,
        @Argument regionId: Int,
        @Argument applicationConfirmationNote: String,
        @Argument applicationConfirmationNoteActivated: Boolean,
    ): Boolean {
        val admin = dfe.requireAuthContext().admin
        transaction {
            if (applicationConfirmationNote.length > APPLICATION_CONFIRMATION_MAIL_NOTE_MAX_CHARS) {
                throw InvalidApplicationConfirmationNoteSizeException(APPLICATION_CONFIRMATION_MAIL_NOTE_MAX_CHARS)
            }
            if (!admin.mayUpdateSettingsInRegion(regionId)) {
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
