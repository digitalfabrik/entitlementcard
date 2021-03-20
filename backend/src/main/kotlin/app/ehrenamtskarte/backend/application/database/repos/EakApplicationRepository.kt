package app.ehrenamtskarte.backend.application.database.repos

import app.ehrenamtskarte.backend.application.database.EakApplicationEntity
import app.ehrenamtskarte.backend.application.database.EakApplications
import app.ehrenamtskarte.backend.application.webservice.schema.create.BlueCardApplication
import app.ehrenamtskarte.backend.application.webservice.schema.create.GoldenEakCardApplication
import app.ehrenamtskarte.backend.application.webservice.schema.view.ApplicationView
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.regions.database.Regions
import com.fasterxml.jackson.databind.json.JsonMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import io.javalin.core.util.FileUtil
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.File

object EakApplicationRepository {

    fun addBlueEakApplication(
        regionId: Int,
        application: BlueCardApplication,
        graphQLContext: GraphQLContext
    ) {
        val valid = validateBlueApplication(application)
        if (!valid)
            return

        val newApplication = transaction {
            EakApplicationEntity.new {
                this.regionId = EntityID(regionId, Regions)
                this.jsonValue = toString(application) ?: throw Error("Error while converting to JSON")
            }
        }

        try {
            graphQLContext.files.forEachIndexed { index, part ->
                FileUtil.streamToFile(
                    part.inputStream,
                    System.getenv("APPLICATIONS_DIRECTORY") + "/" + newApplication.id + "/file/" + index.toString()
                )
            }
        } catch (e: Exception) {
            File(System.getenv("APPLICATIONS_DIRECTORY") + "/" + newApplication.id).deleteRecursively()
            transaction {
                newApplication.delete()
            }
            throw e
        }

    }

    private fun validateBlueApplication(application: BlueCardApplication): Boolean {
        return true // todo add sensible validation
    }

    fun addGoldenEakApplication(
        regionId: Int,
        application: GoldenEakCardApplication,
        graphQLContext: GraphQLContext
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

    private fun toString(obj: JsonFieldSerializable): String {
        val mapper = JsonMapper()
        mapper.registerModule(KotlinModule())
        return mapper.writeValueAsString(obj.toJsonField())
    }

    fun getApplications(regionId: Int): List<ApplicationView> {
        return transaction {
            EakApplicationEntity.find { EakApplications.regiondId eq regionId }
                .map { ApplicationView(it.id.value, it.regionId.value, it.createdDate.toString(), it.jsonValue) }
        }
    }

}
