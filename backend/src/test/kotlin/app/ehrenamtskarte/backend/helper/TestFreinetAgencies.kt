package app.ehrenamtskarte.backend.helper

import app.ehrenamtskarte.backend.exception.webservice.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.freinet.database.FreinetAgencies
import app.ehrenamtskarte.backend.regions.database.RegionEntity
import app.ehrenamtskarte.backend.regions.database.Regions
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.upsert

class TestFreinetAgencies {
    companion object {
        fun create() {
            transaction {
                val region = RegionEntity.find { Regions.id eq 9 }.singleOrNull() ?: throw RegionNotFoundException()
                FreinetAgencies.upsert(FreinetAgencies.agencyId) {
                    it[regionId] = region.id
                    it[agencyId] = 123
                    it[agencyName] = "Demo Mandant"
                    it[apiAccessKey] = "testKey"
                    it[dataTransferActivated] = false
                }
            }
        }
    }
}
