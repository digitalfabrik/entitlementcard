package app.ehrenamtskarte.backend.helper

import app.ehrenamtskarte.backend.db.entities.FreinetAgencies
import app.ehrenamtskarte.backend.db.entities.RegionEntity
import app.ehrenamtskarte.backend.db.entities.Regions
import app.ehrenamtskarte.backend.graphql.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.graphql.shared.FREINET_DEMO_REGION_NAME
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.jetbrains.exposed.v1.jdbc.upsert

class TestFreinetAgencies {
    companion object {
        fun create() {
            transaction {
                val region = RegionEntity.find { Regions.id eq 94 }.singleOrNull() ?: throw RegionNotFoundException()
                FreinetAgencies.upsert(FreinetAgencies.agencyId) {
                    it[regionId] = region.id
                    it[agencyId] = 123
                    it[agencyName] = FREINET_DEMO_REGION_NAME
                    it[apiAccessKey] = "testKey"
                    it[dataTransferActivated] = false
                }
            }
        }
    }
}
