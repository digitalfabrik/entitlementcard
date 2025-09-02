package app.ehrenamtskarte.backend.graphql.regions.dataloader

import app.ehrenamtskarte.backend.common.webservice.newNamedDataLoader
import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.graphql.regions.schema.types.Region
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
