package app.ehrenamtskarte.backend.regions.webservice.schema

import app.ehrenamtskarte.backend.common.webservice.DEFAULT_PROJECT
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.common.webservice.schema.IdsParams
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import app.ehrenamtskarte.backend.regions.webservice.schema.types.Region
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class RegionsQueryService {

    @GraphQLDescription("Return list of all regions in the given project.")
    fun regionsInProject(project: String): List<Region> = transaction {
        RegionsRepository.findAllInProject(project).map {
            Region(it.id.value, it.prefix, it.name, it.regionIdentifier, it.dataPrivacyPolicy, it.activatedForApplication)
        }
    }

    @GraphQLDescription("Returns regions queried by ids in the given project.")
    fun regionsByIdInProject(project: String, ids: List<Int>): List<Region?> = transaction {
        RegionsRepository.findByIdsInProject(project, ids).map {
            if (it == null) {
                null
            } else {
                Region(it.id.value, it.prefix, it.name, it.regionIdentifier, it.dataPrivacyPolicy, it.activatedForApplication)
            }
        }
    }

    @GraphQLDescription("Returns region data for specific region.")
    fun regionByRegionId(regionId: Int): Region = transaction {
        val regionEntity = RegionsRepository.findRegionById(regionId)
        Region(
            regionEntity.id.value,
            regionEntity.prefix,
            regionEntity.name,
            regionEntity.regionIdentifier,
            regionEntity.dataPrivacyPolicy,
            regionEntity.activatedForApplication
        )
    }

    @GraphQLDescription("Returns regions by postal code. Works only for the EAK project in which each region has an appropriate regionIdentifier.")
    fun regionsByPostalCode(dfe: DataFetchingEnvironment, postalCode: String, project: String): List<Region> = transaction {
        val regions = dfe.getContext<GraphQLContext>().regionIdentifierByPostalCode.filter { pair -> pair.first.equals(postalCode) }
        if (regions.isEmpty()) {
            throw RegionNotFoundException()
        }

        val projectEntity = ProjectEntity.find { Projects.project eq project }.firstOrNull()
            ?: throw ProjectNotFoundException(project)

        val regionEntities = regions.map {
                region ->
            RegionsRepository.findRegionByRegionIdentifier(region.second, projectEntity.id)
        }

        regionEntities.map {
            Region(
                it.id.value,
                it.prefix,
                it.name,
                it.regionIdentifier,
                it.dataPrivacyPolicy,
                it.activatedForApplication
            )
        }
    }

    @Deprecated("Deprecated in favor of project specific query", ReplaceWith("regionsInProject"))
    @GraphQLDescription("Return list of all regions in the eak bayern project.")
    fun regions(): List<Region> = regionsInProject(DEFAULT_PROJECT)

    @Deprecated("Deprecated in favor of project specific query", ReplaceWith("regionsByIdInProject"))
    @GraphQLDescription("Returns regions queried by ids in the eak bayern project.")
    fun regionsById(params: IdsParams) = regionsByIdInProject(DEFAULT_PROJECT, params.ids)
}
