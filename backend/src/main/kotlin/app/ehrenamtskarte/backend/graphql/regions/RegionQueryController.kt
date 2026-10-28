package app.ehrenamtskarte.backend.graphql.regions

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.db.entities.APPLICATION_CONFIRMATION_MAIL_NOTE_MAX_CHARS
import app.ehrenamtskarte.backend.db.entities.CONTACT_INFORMATION_MAX_CHARS
import app.ehrenamtskarte.backend.db.entities.ProjectEntity
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.db.entities.mayUpdateSettingsInRegion
import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.graphql.auth.requireAuthContext
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidApplicationConfirmationNoteSizeException
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidContactInformationSizeException
import app.ehrenamtskarte.backend.graphql.exceptions.NotEakProjectException
import app.ehrenamtskarte.backend.graphql.regions.types.Region
import app.ehrenamtskarte.backend.graphql.shared.EAK_BAYERN_PROJECT
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import app.ehrenamtskarte.backend.shared.exceptions.ProjectNotFoundException
import app.ehrenamtskarte.backend.shared.mail.Mailer
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller

@Controller
class RegionQueryController(
    private val regionIdentifierService: RegionIdentifierService,
    private val backendConfiguration: BackendConfiguration,
    private val mailer: Mailer,
) {
    @GraphQLDescription("Return list of all regions in the given project.")
    @QueryMapping
    fun regionsInProject(
        @Argument project: String,
    ): List<Region> =
        transaction {
            RegionsRepository.findAllInProject(project).map {
                Region.fromEntity(it)
            }
        }

    @GraphQLDescription("Returns regions queried by ids in the given project.")
    @QueryMapping
    fun regionsByIdInProject(
        @Argument project: String,
        @Argument ids: List<Int>,
    ): List<Region?> =
        transaction {
            RegionsRepository.findByIdsInProject(project, ids).map { it?.let { region -> Region.fromEntity(region) } }
        }

    @GraphQLDescription("Returns region data for specific region.")
    @QueryMapping
    fun regionByRegionId(
        @Argument regionId: Int,
    ): Region =
        transaction {
            Region.fromEntity(RegionsRepository.findRegionById(regionId))
        }

    @GraphQLDescription(
        "Returns regions by postal code. Works only for the EAK project in which each region has an appropriate regionIdentifier.",
    )
    @QueryMapping
    fun regionsByPostalCode(
        @Argument postalCode: String,
        @Argument project: String,
    ): List<Region> =
        transaction {
            val projectEntity = ProjectEntity.find { Projects.project eq project }.firstOrNull()
                ?: throw ProjectNotFoundException(project)

            if (projectEntity.project != EAK_BAYERN_PROJECT) {
                throw NotEakProjectException()
            }
            regionIdentifierService.regionIdentifierByPostalCode
                .filter { pair -> pair.first == postalCode }
                .mapNotNull { region ->
                    RegionsRepository.findRegionByRegionIdentifier(region.second, projectEntity.id)
                }
                .map { Region.fromEntity(it) }
        }

    @GraphQLDescription(
        "Returns the HTML of the mail that is sent to the applicant after submitting an application, " +
            "filled with example data. The given application confirmation note is included if it is activated " +
            "and not blank.",
    )
    @QueryMapping
    fun getApplicationConfirmationMailPreview(
        dfe: DataFetchingEnvironment,
        @Argument regionId: Int,
        @Argument applicationConfirmationNote: String,
        @Argument applicationConfirmationNoteActivated: Boolean,
    ): String {
        val authContext = dfe.requireAuthContext()
        if (!authContext.admin.mayUpdateSettingsInRegion(regionId)) {
            throw ForbiddenException()
        }
        if (applicationConfirmationNote.length > APPLICATION_CONFIRMATION_MAIL_NOTE_MAX_CHARS) {
            throw InvalidApplicationConfirmationNoteSizeException(APPLICATION_CONFIRMATION_MAIL_NOTE_MAX_CHARS)
        }
        return mailer.getApplicationApplicantMailPreview(
            backendConfiguration.getProjectConfig(authContext.project),
            applicationConfirmationNote,
            applicationConfirmationNoteActivated,
        )
    }

    @GraphQLDescription(
        "Returns the HTML of the mail that is sent to the applicant after submitting an application, " +
            "filled with example data. The given contact information is included if it is activated and not blank.",
    )
    @QueryMapping
    fun getContactInformationMailPreview(
        dfe: DataFetchingEnvironment,
        @Argument regionId: Int,
        @Argument contactInformation: String,
        @Argument contactInformationActivated: Boolean,
    ): String {
        val authContext = dfe.requireAuthContext()
        if (!authContext.admin.mayUpdateSettingsInRegion(regionId)) {
            throw ForbiddenException()
        }
        if (contactInformation.length > CONTACT_INFORMATION_MAX_CHARS) {
            throw InvalidContactInformationSizeException(CONTACT_INFORMATION_MAX_CHARS)
        }
        return mailer.getContactInformationMailPreview(
            backendConfiguration.getProjectConfig(authContext.project),
            contactInformation,
            contactInformationActivated,
        )
    }
}
