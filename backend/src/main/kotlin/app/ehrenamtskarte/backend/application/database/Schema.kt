package app.ehrenamtskarte.backend.application.database

import app.ehrenamtskarte.backend.regions.database.Regions
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

object EakApplications : IntIdTable() {
    val regiondId = reference("regionId", Regions)
    val valueBlob = blob("value")
}

class EakApplicationEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<EakApplicationEntity>(
        EakApplications
    )

    var regionId by EakApplications.regiondId
    var valueBlob by EakApplications.valueBlob
}
