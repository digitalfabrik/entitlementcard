package app.ehrenamtskarte.backend.graphql.freinet

import app.ehrenamtskarte.backend.graphql.getAuthContext
import app.ehrenamtskarte.backend.db.entities.mayViewFreinetAgencyInformationInRegion
import app.ehrenamtskarte.backend.graphql.shared.context
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.NotImplementedException
import app.ehrenamtskarte.backend.db.repositories.FreinetAgencyRepository
import app.ehrenamtskarte.backend.graphql.freinet.schema.types.FreinetAgency
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

            if (!authContext.admin.mayViewFreinetAgencyInformationInRegion(regionId)) {
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
