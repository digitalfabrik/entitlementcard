package app.ehrenamtskarte.backend.regions.webservice.dataloader

import app.ehrenamtskarte.backend.common.webservice.newNamedDataLoader
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import app.ehrenamtskarte.backend.regions.webservice.schema.types.Region
import org.jetbrains.exposed.sql.transactions.transaction

val regionLoader = newNamedDataLoader("REGION_LOADER") { ids ->
    transaction {
        RegionsRepository.findByIds(ids).map {
            it?.let {
                Region(
                    it.id.value,
                    it.prefix,
                    it.name,
                    it.regionIdentifier,
                    it.dataPrivacyPolicy,
                    it.activatedForApplication,
                    it.activatedForCardConfirmationMail,
                    it.applicationConfirmationMailNoteActivated,
                    it.applicationConfirmationMailNote,
                )
            }
        }
    }
}
