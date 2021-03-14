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
            this.jsonValue = toString(application) ?: throw Error("Error while converting to JSON")
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
            this.jsonValue = toString(application) ?: throw Error("Error while converting to JSON")
        }
    }

    private fun verifyGoldenApplication(application: GoldenEakCardApplication): Boolean {
        return true
    }

    private fun toString(obj: Any): String? {
        val mapper = JsonMapper()
        mapper.registerModule(KotlinModule())
        return mapper.writeValueAsString(obj)
    }

}
