package app.ehrenamtskarte.backend.application.database.repos

import app.ehrenamtskarte.backend.application.database.EakApplicationEntity
import app.ehrenamtskarte.backend.application.webservice.schema.create.BlueEakCardApplication
import app.ehrenamtskarte.backend.application.webservice.schema.create.GoldenEakCardApplication
import app.ehrenamtskarte.backend.regions.database.Regions
import com.fasterxml.jackson.databind.json.JsonMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.statements.api.ExposedBlob

object EakApplicationRepository {

    fun addBlueEakApplication(application: BlueEakCardApplication) {
        val valid = verifyBlueApplication(application)
        if (!valid)
            return

        EakApplicationEntity.new {
            this.regionId = EntityID(1, Regions)
            this.valueBlob = ExposedBlob(toBytes(application))
        }
    }

    private fun verifyBlueApplication(application: BlueEakCardApplication): Boolean {
        return true
    }

    fun addGoldenEakApplication(application: GoldenEakCardApplication) {
        val valid = verifyGoldenApplication(application)
        if (!valid)
            return

        EakApplicationEntity.new {
            this.regionId = EntityID(0, Regions)
            this.valueBlob = ExposedBlob(toBytes(application))
        }
    }

    private fun verifyGoldenApplication(application: GoldenEakCardApplication): Boolean {
        return true
    }

    private fun toBytes(obj: Any): ByteArray {
        val mapper = JsonMapper()
        mapper.registerModule(KotlinModule())
        mapper.writeValueAsBytes(obj)
        return mapper.writeValueAsBytes(obj)
    }

}
