package app.ehrenamtskarte.backend.db.migration

import app.ehrenamtskarte.backend.db.entities.ApplicationVerifications
import app.ehrenamtskarte.backend.db.entities.Applications
import app.ehrenamtskarte.backend.db.entities.Administrators
import app.ehrenamtskarte.backend.db.entities.ApiTokens
import app.ehrenamtskarte.backend.db.entities.Cards
import app.ehrenamtskarte.backend.db.entities.FreinetAgencies
import app.ehrenamtskarte.backend.db.entities.Migrations
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.db.entities.Regions
import app.ehrenamtskarte.backend.db.entities.AcceptingStores
import app.ehrenamtskarte.backend.db.entities.Addresses
import app.ehrenamtskarte.backend.db.entities.Categories
import app.ehrenamtskarte.backend.db.entities.Contacts
import app.ehrenamtskarte.backend.db.entities.PhysicalStores
import app.ehrenamtskarte.backend.db.entities.UserEntitlements

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
