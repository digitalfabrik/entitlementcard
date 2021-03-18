package app.ehrenamtskarte.backend.application.database.repos

import app.ehrenamtskarte.backend.application.database.EakApplicationEntity
import app.ehrenamtskarte.backend.application.webservice.schema.create.BlueCardApplication
import app.ehrenamtskarte.backend.application.webservice.schema.create.GoldenEakCardApplication
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable
import app.ehrenamtskarte.backend.regions.database.Regions
import com.fasterxml.jackson.databind.json.JsonMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.transactions.transaction

object EakApplicationRepository {

    fun addBlueEakApplication(
        regionId: Int,
        application: BlueCardApplication,
        dataFetchingEnvironment: DataFetchingEnvironment
    ) {
        val valid = validateBlueApplication(application)
        if (!valid)
            return

        // todo: Save attachments using dataFetchingEnvironment

        transaction {
            EakApplicationEntity.new {
                this.regionId = EntityID(regionId, Regions)
                this.jsonValue = toString(application) ?: throw Error("Error while converting to JSON")
            }
        }

        // todo: Clear attachments if transaction failed
    }

    private fun validateBlueApplication(application: BlueCardApplication): Boolean {
        return true // todo add sensible validation
    }

    fun addGoldenEakApplication(
        regionId: Int,
        application: GoldenEakCardApplication,
        dataFetchingEnvironment: DataFetchingEnvironment
    ) {
        val valid = validateGoldenApplication(application)
        if (!valid)
            return

        // todo: Save attachments using dataFetchingEnvironment

        transaction {
            EakApplicationEntity.new {
                this.regionId = EntityID(regionId, Regions)
                this.jsonValue = toString(application) ?: throw Error("Error while converting to JSON")
            }
        }

        // todo: Clear attachments if transaction failed
    }

    private fun validateGoldenApplication(application: GoldenEakCardApplication): Boolean {
        return true // todo add sensible validation
    }

    private fun toString(obj: JsonFieldSerializable): String? {
        val mapper = JsonMapper()
        mapper.registerModule(KotlinModule())
        return mapper.writeValueAsString(obj.toJsonField())
    }

}
