package app.ehrenamtskarte.backend.application.database

import app.ehrenamtskarte.backend.regions.database.Regions
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.javatime.datetime

object Applications : IntIdTable() {
    val regionId = reference("regionId", Regions)
    val jsonValue = text("jsonValue")
    val createdDate = datetime("createdDate").defaultExpression(CurrentDateTime)
}

class ApplicationEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<ApplicationEntity>(
        Applications
    )

    var regionId by Applications.regionId
    var jsonValue by Applications.jsonValue
    var createdDate by Applications.createdDate
}
