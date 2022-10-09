package app.ehrenamtskarte.backend.application.database

import app.ehrenamtskarte.backend.regions.database.Regions
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.javatime.datetime

object EakApplications : IntIdTable() {
    val regionId = reference("regionId", Regions)
    val jsonValue = text("jsonValue")
    val createdDate = datetime("createdDate").defaultExpression(CurrentDateTime)
}

class EakApplicationEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<EakApplicationEntity>(
        EakApplications
    )

    var regionId by EakApplications.regionId
    var jsonValue by EakApplications.jsonValue
    var createdDate by EakApplications.createdDate
}
