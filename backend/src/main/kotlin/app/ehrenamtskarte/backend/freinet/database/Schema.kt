package app.ehrenamtskarte.backend.freinet.database

import app.ehrenamtskarte.backend.regions.database.Regions
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

object FreinetAgencies : IntIdTable() {
    val regionId = reference("regionId", Regions)
    val agencyId = integer("agencyId").uniqueIndex()
    val apiAccessKey = varchar("apiAccessKey", 10)
    val activated = bool("activated").default(false)
}

class FreinetAgenciesEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<FreinetAgenciesEntity>(FreinetAgencies)

    var regionId by FreinetAgencies.regionId
    var agencyId by FreinetAgencies.agencyId
    var apiAccessKey by FreinetAgencies.apiAccessKey
    var activated by FreinetAgencies.activated
}
