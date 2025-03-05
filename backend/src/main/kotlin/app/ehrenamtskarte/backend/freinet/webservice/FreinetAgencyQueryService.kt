package app.ehrenamtskarte.backend.freinet.webservice

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.EAK_BAYERN_PROJECT
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.NotEakProjectException
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.freinet.database.repos.FreinetAgencyRepository
import app.ehrenamtskarte.backend.freinet.webservice.schema.types.FreinetAgency
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class FreinetAgencyQueryService {
    @GraphQLDescription("Returns freinet agency information for a particular region. Works only for the EAK project.")
    fun getFreinetAgencyByRegionId(dfe: DataFetchingEnvironment, regionId: Int, project: String): FreinetAgency? = transaction {
        val context = dfe.getContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()
        val admin = AdministratorEntity.findById(jwtPayload.adminId) ?: throw UnauthorizedException()
        if (!Authorizer.mayViewFreinetAgencyInformationInRegion(admin, regionId)) {
            throw ForbiddenException()
        }
        ProjectEntity.find { Projects.project eq project }.firstOrNull()
            ?.let {
                if (it.project != EAK_BAYERN_PROJECT) {
                    throw NotEakProjectException()
                }
            }
            ?: throw ProjectNotFoundException(project)
        FreinetAgencyRepository.getFreinetAgencyByRegionId(regionId)?.let {
            FreinetAgency(
                agencyId = it.agencyId,
                apiAccessKey = it.apiAccessKey,
                agencyName = it.agencyName,
                dataTransferActivated = it.dataTransferActivated
            )
        }
    }
}
