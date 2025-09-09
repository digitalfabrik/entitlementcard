package app.ehrenamtskarte.backend.graphql.regions.schema

import app.ehrenamtskarte.backend.db.entities.ProjectEntity
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.graphql.shared.exceptions.NotEakProjectException
import app.ehrenamtskarte.backend.shared.exceptions.ProjectNotFoundException
import app.ehrenamtskarte.backend.graphql.shared.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.graphql.regions.schema.types.Region
import app.ehrenamtskarte.backend.graphql.shared.DEFAULT_PROJECT
import app.ehrenamtskarte.backend.graphql.shared.EAK_BAYERN_PROJECT
import app.ehrenamtskarte.backend.graphql.shared.context
import app.ehrenamtskarte.backend.graphql.shared.schema.IdsParams
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class RegionsQueryService {
    @GraphQLDescription("Return list of all regions in the given project.")
    fun regionsInProject(project: String): List<Region> =
        transaction {
            RegionsRepository.findAllInProject(project).map {
                Region(
                    it.id.value,
                    it.prefix,
                    it.name,
                    it.regionIdentifier,
                    it.dataPrivacyPolicy,
                    it.activatedForApplication,
                    it.activatedForCardConfirmationMail,
                    it.applicationConfirmationMailNoteActivated,
                    it.applicationConfirmationMailNote,
                )
            }
        }

    @GraphQLDescription("Returns regions queried by ids in the given project.")
    fun regionsByIdInProject(project: String, ids: List<Int>): List<Region?> =
        transaction {
            RegionsRepository.findByIdsInProject(project, ids).map {
                if (it == null) {
                    null
                } else {
                    Region(
                        it.id.value,
                        it.prefix,
                        it.name,
                        it.regionIdentifier,
                        it.dataPrivacyPolicy,
                        it.activatedForApplication,
                        it.activatedForCardConfirmationMail,
                        it.applicationConfirmationMailNoteActivated,
                        it.applicationConfirmationMailNote,
                    )
                }
            }
        }

    @GraphQLDescription("Returns region data for specific region.")
    fun regionByRegionId(regionId: Int): Region =
        transaction {
            val regionEntity = RegionsRepository.findRegionById(regionId)
            Region(
                regionEntity.id.value,
                regionEntity.prefix,
                regionEntity.name,
                regionEntity.regionIdentifier,
                regionEntity.dataPrivacyPolicy,
                regionEntity.activatedForApplication,
                regionEntity.activatedForCardConfirmationMail,
                regionEntity.applicationConfirmationMailNoteActivated,
                regionEntity.applicationConfirmationMailNote,
            )
        }

    @GraphQLDescription(
        "Returns regions by postal code. Works only for the EAK project in which each region has an appropriate regionIdentifier.",
    )
    fun regionsByPostalCode(dfe: DataFetchingEnvironment, postalCode: String, project: String): List<Region> =
        transaction {
            val projectEntity = ProjectEntity.find { Projects.project eq project }.firstOrNull()
                ?: throw ProjectNotFoundException(project)

            if (projectEntity.project != EAK_BAYERN_PROJECT) {
                throw NotEakProjectException()
            }
            val regionEntities = dfe.graphQlContext.context.regionIdentifierByPostalCode
                .filter { pair -> pair.first == postalCode }
                .mapNotNull { region ->
                    RegionsRepository.findRegionByRegionIdentifier(region.second, projectEntity.id)
                }
                .takeIf { it.isNotEmpty() }
                ?: throw RegionNotFoundException()

            regionEntities.map {
                Region(
                    it.id.value,
                    it.prefix,
                    it.name,
                    it.regionIdentifier,
                    it.dataPrivacyPolicy,
                    it.activatedForApplication,
                    it.activatedForCardConfirmationMail,
                    it.applicationConfirmationMailNoteActivated,
                    it.applicationConfirmationMailNote,
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
