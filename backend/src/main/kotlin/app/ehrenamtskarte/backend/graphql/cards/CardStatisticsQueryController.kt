package app.ehrenamtskarte.backend.graphql.cards

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.db.entities.RegionEntity
import app.ehrenamtskarte.backend.db.entities.mayViewCardStatisticsInProject
import app.ehrenamtskarte.backend.db.entities.mayViewCardStatisticsInRegion
import app.ehrenamtskarte.backend.db.repositories.CardRepository
import app.ehrenamtskarte.backend.graphql.auth.requireAuthContext
import app.ehrenamtskarte.backend.graphql.cards.types.CardStatisticsResultModel
import app.ehrenamtskarte.backend.graphql.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import app.ehrenamtskarte.backend.shared.utils.dateStringToEndOfDayInstant
import app.ehrenamtskarte.backend.shared.utils.dateStringToStartOfDayInstant
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller

@Controller
class CardStatisticsQueryController(
    @Suppress("SpringJavaInjectionPointsAutowiringInspection")
    private val backendConfiguration: BackendConfiguration,
) {
    @GraphQLDescription("Returns card statistics for project. Start and end dates are inclusive.")
    @QueryMapping
    fun getCardStatisticsInProject(
        @Argument dateStart: String,
        @Argument dateEnd: String,
        dfe: DataFetchingEnvironment,
    ): List<CardStatisticsResultModel> {
        val authContext = dfe.requireAuthContext()
        val projectConfig = backendConfiguration.getProjectConfig(authContext.project)

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
    @QueryMapping
    fun getCardStatisticsInRegion(
        @Argument regionId: Int,
        @Argument dateStart: String,
        @Argument dateEnd: String,
        dfe: DataFetchingEnvironment,
    ): List<CardStatisticsResultModel> {
        val authContext = dfe.requireAuthContext()
        val projectConfig = backendConfiguration.getProjectConfig(authContext.project)

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
