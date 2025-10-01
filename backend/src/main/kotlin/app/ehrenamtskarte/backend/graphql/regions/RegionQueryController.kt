package app.ehrenamtskarte.backend.graphql.regions

import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.graphql.regions.types.Region
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller

@Controller
class RegionQueryController {
    @GraphQLDescription("Return list of all regions in the given project.")
    @QueryMapping
    fun regionsInProject(
        @Argument project: String,
    ): List<Region> =
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
    @QueryMapping
    fun regionsByIdInProject(
        @Argument project: String,
        @Argument ids: List<Int>,
    ): List<Region?> =
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
    @QueryMapping
    fun regionByRegionId(
        @Argument regionId: Int,
    ): Region =
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

    // TODO-2507: to be migrated separately
    // @GraphQLDescription(
    //    "Returns regions by postal code. Works only for the EAK project in which each region has an appropriate regionIdentifier.",
    // )
    // @QueryMapping
    // fun regionsByPostalCode(dfe: DataFetchingEnvironment, @Argument postalCode: String, @Argument project: String): List<Region> =
    //    transaction {
    //        val projectEntity = ProjectEntity.find { Projects.project eq project }.firstOrNull()
    //            ?: throw ProjectNotFoundException(project)

    //        if (projectEntity.project != EAK_BAYERN_PROJECT) {
    //            throw NotEakProjectException()
    //        }
    //        val regionEntities = dfe.graphQlContext.context.regionIdentifierByPostalCode
    //            .filter { pair -> pair.first == postalCode }
    //            .mapNotNull { region ->
    //                RegionsRepository.findRegionByRegionIdentifier(region.second, projectEntity.id)
    //            }
    //            .takeIf { it.isNotEmpty() }
    //            ?: throw RegionNotFoundException()

    //        regionEntities.map {
    //            Region(
    //                it.id.value,
    //                it.prefix,
    //                it.name,
    //                it.regionIdentifier,
    //                it.dataPrivacyPolicy,
    //                it.activatedForApplication,
    //                it.activatedForCardConfirmationMail,
    //                it.applicationConfirmationMailNoteActivated,
    //                it.applicationConfirmationMailNote,
    //            )
    //        }
    //    }
}
