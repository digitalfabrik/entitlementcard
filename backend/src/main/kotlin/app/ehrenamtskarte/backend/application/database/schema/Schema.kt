package app.ehrenamtskarte.backend.application.database.schema

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

object EakApplications : IntIdTable() {
    val communalDistrict = varchar("name", 50)
    val valueBlob = text("value")
}

class EakApplicationEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<EakApplicationEntity>(EakApplications)

    var communalDistrict by EakApplications.communalDistrict
    var valueBlob by EakApplications.valueBlob
}
