package app.ehrenamtskarte.backend.helper

import app.ehrenamtskarte.backend.common.webservice.FREINET_DEMO_REGION_NAME
import app.ehrenamtskarte.backend.exception.webservice.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.db.entities.FreinetAgencies
import app.ehrenamtskarte.backend.db.entities.RegionEntity
import app.ehrenamtskarte.backend.db.entities.Regions
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.upsert

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
