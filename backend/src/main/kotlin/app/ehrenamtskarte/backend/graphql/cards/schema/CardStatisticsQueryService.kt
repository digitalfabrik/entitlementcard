package app.ehrenamtskarte.backend.graphql.cards.schema

import app.ehrenamtskarte.backend.db.entities.RegionEntity
import app.ehrenamtskarte.backend.db.entities.mayViewCardStatisticsInProject
import app.ehrenamtskarte.backend.db.entities.mayViewCardStatisticsInRegion
import app.ehrenamtskarte.backend.db.repositories.CardRepository
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.graphql.cards.schema.types.CardStatisticsResultModel
import app.ehrenamtskarte.backend.graphql.shared.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.graphql.getAuthContext
import app.ehrenamtskarte.backend.graphql.shared.context
import app.ehrenamtskarte.backend.shared.utils.dateStringToEndOfDayInstant
import app.ehrenamtskarte.backend.shared.utils.dateStringToStartOfDayInstant
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class CardStatisticsQueryService {
    @GraphQLDescription("Returns card statistics for project. Start and end dates are inclusive.")
    fun getCardStatisticsInProject(
        dateStart: String,
        dateEnd: String,
        dfe: DataFetchingEnvironment,
    ): List<CardStatisticsResultModel> {
        val context = dfe.graphQlContext.context
        val authContext = context.getAuthContext()
        val projectConfig = context.backendConfiguration.getProjectConfig(authContext.project)

        return transaction {
            val projectId = authContext.projectId

            if (!authContext.admin.mayViewCardStatisticsInProject(projectId)) {
                throw ForbiddenException()
            }

            CardRepository.getCardStatisticsByProjectAndRegion(
                projectId,
                dateStringToStartOfDayInstant(dateStart, projectConfig.timezone),
                dateStringToEndOfDayInstant(dateEnd, projectConfig.timezone),
                null,
            )
        }
    }

    @GraphQLDescription("Returns card statistics for region. Start and end dates are inclusive.")
    fun getCardStatisticsInRegion(
        regionId: Int,
        dateStart: String,
        dateEnd: String,
        dfe: DataFetchingEnvironment,
    ): List<CardStatisticsResultModel> {
        val context = dfe.graphQlContext.context
        val authContext = context.getAuthContext()
        val projectConfig = context.backendConfiguration.getProjectConfig(authContext.project)

        return transaction {
            val region = RegionEntity.findById(regionId) ?: throw RegionNotFoundException()

            if (!authContext.admin.mayViewCardStatisticsInRegion(region.id.value)) {
                throw ForbiddenException()
            }

            CardRepository.getCardStatisticsByProjectAndRegion(
                authContext.projectId,
                dateStringToStartOfDayInstant(dateStart, projectConfig.timezone),
                dateStringToEndOfDayInstant(dateEnd, projectConfig.timezone),
                regionId,
            )
        }
    }
}
