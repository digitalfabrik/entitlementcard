package app.ehrenamtskarte.backend.application.database.repos

import app.ehrenamtskarte.backend.application.database.EakApplicationEntity
import app.ehrenamtskarte.backend.application.database.EakApplications
import app.ehrenamtskarte.backend.application.webservice.schema.create.BlueCardApplication
import app.ehrenamtskarte.backend.application.webservice.schema.create.GoldenCardApplication
import app.ehrenamtskarte.backend.application.webservice.schema.view.ApplicationView
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.regions.database.Regions
import com.fasterxml.jackson.databind.json.JsonMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import io.javalin.util.FileUtil
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.File

object EakApplicationRepository {

    fun <T> addEakApplication(
        regionId: Int,
        application: T,
        graphQLContext: GraphQLContext,
        validate: (application: T) -> Boolean
    ) where T : JsonFieldSerializable {
        if (!validate(application)) {
            return
        }

        persistApplication(toString(application), regionId, graphQLContext)
    }

    fun validateBlueApplication(application: BlueCardApplication): Boolean {
        return true // todo add sensible validation
    }

    fun validateGoldenApplication(application: GoldenCardApplication): Boolean {
        return true // todo add sensible validation
    }

    private fun persistApplication(
        applicationJson: String,
        regionId: Int,
        graphQLContext: GraphQLContext
    ) {
        val newApplication = transaction {
            EakApplicationEntity.new {
                this.regionId = EntityID(regionId, Regions)
                this.jsonValue = applicationJson
            }
        }

        val applicationDirectory = File(graphQLContext.applicationData, newApplication.id.toString())

        try {
            graphQLContext.files.forEachIndexed { index, part ->
                FileUtil.streamToFile(
                    part.inputStream,
                    File(applicationDirectory, "file/$index").absolutePath
                )
            }
        } catch (e: Exception) {
            applicationDirectory.deleteRecursively()
            transaction {
                newApplication.delete()
            }
            throw e
        }
    }

    private fun toString(obj: JsonFieldSerializable): String {
        val mapper = JsonMapper()
        mapper.registerModule(KotlinModule.Builder().build())
        return mapper.writeValueAsString(obj.toJsonField())
    }

    fun getApplications(regionId: Int): List<ApplicationView> {
        return transaction {
            EakApplicationEntity.find { EakApplications.regionId eq regionId }
                .map { ApplicationView(it.id.value, it.regionId.value, it.createdDate.toString(), it.jsonValue) }
        }
    }

    fun delete(applicationId: Int, graphQLContext: GraphQLContext): Boolean {
        return transaction {
            val application = EakApplicationEntity.findById(applicationId)
            if (application != null) {
                val applicationDirectory = File(graphQLContext.applicationData, application.id.toString())
                application.delete()
                return@transaction applicationDirectory.deleteRecursively()
            } else false
        }
    }
}
