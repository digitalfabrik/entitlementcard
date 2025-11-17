package app.ehrenamtskarte.backend.graphql.regions.types

import app.ehrenamtskarte.backend.db.entities.RegionEntity

data class Region(
    val id: Int,
    val prefix: String,
    val name: String,
    val regionIdentifier: String?,
    val dataPrivacyPolicy: String?,
    val activatedForApplication: Boolean,
    val activatedForCardConfirmationMail: Boolean,
    val applicationConfirmationMailNoteActivated: Boolean,
    val applicationConfirmationMailNote: String?,
) {
    companion object {
        fun fromDbEntity(entity: RegionEntity): Region =
            Region(
                entity.id.value,
                entity.prefix,
                entity.name,
                entity.regionIdentifier,
                entity.dataPrivacyPolicy,
                entity.activatedForApplication,
                entity.activatedForCardConfirmationMail,
                entity.applicationConfirmationMailNoteActivated,
                entity.applicationConfirmationMailNote,
            )
    }
}
