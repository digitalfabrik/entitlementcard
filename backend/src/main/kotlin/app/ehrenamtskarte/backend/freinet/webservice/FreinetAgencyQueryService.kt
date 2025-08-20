package app.ehrenamtskarte.backend.freinet.webservice

import app.ehrenamtskarte.backend.auth.getAuthContext
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.NotImplementedException
import app.ehrenamtskarte.backend.freinet.database.repos.FreinetAgencyRepository
import app.ehrenamtskarte.backend.freinet.webservice.schema.types.FreinetAgency
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class FreinetAgencyQueryService {
    @GraphQLDescription(
        "Returns freinet agency information for a particular region. Works only for the EAK project.",
    )
    fun getFreinetAgencyByRegionId(dfe: DataFetchingEnvironment, regionId: Int): FreinetAgency? =
        transaction {
            val context = dfe.graphQlContext.context
            val authContext = context.getAuthContext()
            val projectConfig = context.backendConfiguration.getProjectConfig(authContext.project)

            if (projectConfig.freinet == null) {
                throw NotImplementedException()
            }

            if (!Authorizer.mayViewFreinetAgencyInformationInRegion(authContext.admin, regionId)) {
                throw ForbiddenException()
            }

            FreinetAgencyRepository.getFreinetAgencyByRegionId(regionId)?.let {
                FreinetAgency(
                    agencyId = it.agencyId,
                    apiAccessKey = it.apiAccessKey,
                    agencyName = it.agencyName,
                    dataTransferActivated = it.dataTransferActivated,
                )
            }
        }
}
