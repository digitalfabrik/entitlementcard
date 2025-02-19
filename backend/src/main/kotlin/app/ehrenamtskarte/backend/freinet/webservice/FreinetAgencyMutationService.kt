package app.ehrenamtskarte.backend.freinet.webservice

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.EAK_BAYERN_PROJECT
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.NotEakProjectException
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
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
    fun updateDataTransferToFreinet(dfe: DataFetchingEnvironment, regionId: Int, project: String, dataTransferActivated: Boolean): Boolean {
        val context = dfe.getContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()
        transaction {
            val admin =
                AdministratorEntity.findById(jwtPayload.adminId)
                    ?: throw UnauthorizedException()
            val projectEntity = ProjectEntity.find { Projects.project eq project }.firstOrNull()
                ?: throw ProjectNotFoundException(project)

            if (projectEntity.project != EAK_BAYERN_PROJECT) {
                throw NotEakProjectException()
            }
            if (!Authorizer.mayUpdateFreinetAgencyInformationInRegion(admin, regionId)) {
                throw ForbiddenException()
            }
            val freinetAgency = FreinetAgencyRepository.getFreinetAgencyByRegionId(regionId) ?: throw FreinetAgencyNotFoundException()
            FreinetAgencyRepository.updateFreinetDataTransfer(freinetAgency, dataTransferActivated)
        }
        return true
    }
}
