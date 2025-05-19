package app.ehrenamtskarte.backend.cards.webservice.schema

import app.ehrenamtskarte.backend.auth.getAdministrator
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.cards.database.repos.CardRepository
import app.ehrenamtskarte.backend.cards.webservice.schema.types.CardStatisticsResultModel
import app.ehrenamtskarte.backend.common.utils.dateStringToEndOfDayInstant
import app.ehrenamtskarte.backend.common.utils.dateStringToStartOfDayInstant
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.RegionEntity
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class CardStatisticsQueryService {
    @GraphQLDescription("Returns card statistics for project. Start and end dates are inclusive.")
    fun getCardStatisticsInProject(
        project: String,
        dateStart: String,
        dateEnd: String,
        dfe: DataFetchingEnvironment,
    ): List<CardStatisticsResultModel> {
        val context = dfe.graphQlContext.context
        val admin = context.getAdministrator()

        return transaction {
            val projectEntity = ProjectEntity.find { Projects.project eq project }.firstOrNull()
                ?: throw ProjectNotFoundException(project)
            val projectConfig = context.backendConfiguration.getProjectConfig(project)
            val projectId = projectEntity.id.value
            if (!Authorizer.mayViewCardStatisticsInProject(admin, projectId)) {
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
        project: String,
        regionId: Int,
        dateStart: String,
        dateEnd: String,
        dfe: DataFetchingEnvironment,
    ): List<CardStatisticsResultModel> {
        val context = dfe.graphQlContext.context
        val admin = context.getAdministrator()

        return transaction {
            val projectEntity = ProjectEntity.find { Projects.project eq project }.firstOrNull()
                ?: throw ProjectNotFoundException(project)
            val projectConfig = context.backendConfiguration.getProjectConfig(project)
            val region = RegionEntity.findById(regionId) ?: throw RegionNotFoundException()

            if (!Authorizer.mayViewCardStatisticsInRegion(admin, region.id.value)) {
                throw ForbiddenException()
            }

            CardRepository.getCardStatisticsByProjectAndRegion(
                projectEntity.id.value,
                dateStringToStartOfDayInstant(dateStart, projectConfig.timezone),
                dateStringToEndOfDayInstant(dateEnd, projectConfig.timezone),
                regionId,
            )
        }
    }
}
