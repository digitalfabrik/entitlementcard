package app.ehrenamtskarte.backend.cards.webservice.schema

import app.ehrenamtskarte.backend.graphql.getAuthContext
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.db.repositories.CardRepository
import app.ehrenamtskarte.backend.cards.webservice.schema.types.CardStatisticsResultModel
import app.ehrenamtskarte.backend.common.utils.dateStringToEndOfDayInstant
import app.ehrenamtskarte.backend.common.utils.dateStringToStartOfDayInstant
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.db.entities.RegionEntity
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

            if (!Authorizer.mayViewCardStatisticsInProject(authContext.admin, projectId)) {
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

            if (!Authorizer.mayViewCardStatisticsInRegion(authContext.admin, region.id.value)) {
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
