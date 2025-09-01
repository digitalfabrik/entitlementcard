package app.ehrenamtskarte.backend.freinet.webservice

import app.ehrenamtskarte.backend.auth.getAuthContext
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.NotImplementedException
import app.ehrenamtskarte.backend.freinet.database.repos.FreinetAgencyRepository
import app.ehrenamtskarte.backend.freinet.exceptions.FreinetAgencyNotFoundException
import app.ehrenamtskarte.backend.freinet.util.validateFreinetDataTransferPermission
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class FreinetAgencyMutationService {
    @GraphQLDescription("Updates the data transfer to freinet. Works only for the EAK project.")
    fun updateDataTransferToFreinet(
        dfe: DataFetchingEnvironment,
        regionId: Int,
        dataTransferActivated: Boolean,
    ): Boolean {
        val context = dfe.graphQlContext.context
        val authContext = context.getAuthContext()
        val projectConfig = context.backendConfiguration.getProjectConfig(authContext.project)

        if (projectConfig.freinet == null) {
            throw NotImplementedException()
        }

        transaction {
            val region = RegionsRepository.findRegionById(regionId)

            if (dataTransferActivated) {
                validateFreinetDataTransferPermission(context.backendConfiguration.environment, region.name)
            }
            if (!Authorizer.mayUpdateFreinetAgencyInformationInRegion(authContext.admin, regionId)) {
                throw ForbiddenException()
            }
            val freinetAgency = FreinetAgencyRepository.getFreinetAgencyByRegionId(regionId)
                ?: throw FreinetAgencyNotFoundException()
            FreinetAgencyRepository.updateFreinetDataTransfer(freinetAgency, dataTransferActivated)
        }
        return true
    }
}
