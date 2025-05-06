package app.ehrenamtskarte.backend.freinet.webservice

import app.ehrenamtskarte.backend.auth.getAdministrator
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.NotImplementedException
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.FreinetAgencyNotFoundException
import app.ehrenamtskarte.backend.freinet.database.repos.FreinetAgencyRepository
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class FreinetAgencyMutationService {
    @GraphQLDescription("Updates the data transfer to freinet. Works only for the EAK project.")
    fun updateDataTransferToFreinet(
        dfe: DataFetchingEnvironment,
        regionId: Int,
        project: String,
        dataTransferActivated: Boolean,
    ): Boolean {
        val context = dfe.graphQlContext.context
        val admin = context.getAdministrator()
        val projectConfig = dfe.graphQlContext.context.backendConfiguration.getProjectConfig(
            project,
        )
        if (projectConfig.freinet == null) {
            throw NotImplementedException()
        }
        transaction {
            ProjectEntity.find { Projects.project eq project }.firstOrNull()
                ?: throw ProjectNotFoundException(project)
            if (!Authorizer.mayUpdateFreinetAgencyInformationInRegion(admin, regionId)) {
                throw ForbiddenException()
            }
            val freinetAgency = FreinetAgencyRepository
                .getFreinetAgencyByRegionId(regionId)
                ?: throw FreinetAgencyNotFoundException()
            FreinetAgencyRepository.updateFreinetDataTransfer(freinetAgency, dataTransferActivated)
        }
        return true
    }
}
