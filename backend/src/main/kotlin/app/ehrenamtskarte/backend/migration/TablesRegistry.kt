package app.ehrenamtskarte.backend.migration

import app.ehrenamtskarte.backend.db.entities.ApplicationVerifications
import app.ehrenamtskarte.backend.db.entities.Applications
import app.ehrenamtskarte.backend.db.entities.Administrators
import app.ehrenamtskarte.backend.db.entities.ApiTokens
import app.ehrenamtskarte.backend.db.entities.Cards
import app.ehrenamtskarte.backend.db.entities.FreinetAgencies
import app.ehrenamtskarte.backend.migration.database.Migrations
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.Regions
import app.ehrenamtskarte.backend.stores.database.AcceptingStores
import app.ehrenamtskarte.backend.stores.database.Addresses
import app.ehrenamtskarte.backend.stores.database.Categories
import app.ehrenamtskarte.backend.stores.database.Contacts
import app.ehrenamtskarte.backend.stores.database.PhysicalStores
import app.ehrenamtskarte.backend.userdata.database.UserEntitlements

object TablesRegistry {
    fun getAllTables() =
        arrayOf(
            Cards,
            Applications,
            ApplicationVerifications,
            Administrators,
            Migrations,
            Projects,
            Regions,
            PhysicalStores,
            AcceptingStores,
            Addresses,
            Contacts,
            Categories,
            UserEntitlements,
            ApiTokens,
            FreinetAgencies,
        )
}
