package app.ehrenamtskarte.backend.db.migration.migrations

import app.ehrenamtskarte.backend.db.migration.Migration
import app.ehrenamtskarte.backend.db.migration.Statement

/**
 * Adds an index on cards.entitlementId to speed up revocation lookups during user entitlement imports.
 */
@Suppress("ClassName")
internal class V0033_AddIndexOnCardsEntitlementId : Migration() {
    override val migrate: Statement = {
        exec("""CREATE INDEX cards_entitlementid_idx ON cards ("entitlementId");""")
    }
}
