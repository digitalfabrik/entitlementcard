package app.ehrenamtskarte.backend.db.entities

import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.core.dao.id.IntIdTable
import org.jetbrains.exposed.v1.dao.IntEntity
import org.jetbrains.exposed.v1.dao.IntEntityClass

object FreinetAgencies : IntIdTable() {
    val regionId = reference("regionId", Regions)
    val agencyId = integer("agencyId").uniqueIndex()
    val agencyName = varchar("agencyName", 255)
    val apiAccessKey = varchar("apiAccessKey", 100)
    val dataTransferActivated = bool("dataTransferActivated").default(false)
}

class FreinetAgenciesEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<FreinetAgenciesEntity>(FreinetAgencies)

    var regionId by FreinetAgencies.regionId
    var agencyId by FreinetAgencies.agencyId
    var agencyName by FreinetAgencies.agencyName
    var apiAccessKey by FreinetAgencies.apiAccessKey
    var dataTransferActivated by FreinetAgencies.dataTransferActivated
}
