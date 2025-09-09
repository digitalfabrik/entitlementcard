package app.ehrenamtskarte.backend.graphql.freinet

import app.ehrenamtskarte.backend.db.entities.mayUpdateFreinetAgencyInformationInRegion
import app.ehrenamtskarte.backend.db.repositories.FreinetAgencyRepository
import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.NotImplementedException
import app.ehrenamtskarte.backend.graphql.freinet.exceptions.FreinetAgencyNotFoundException
import app.ehrenamtskarte.backend.graphql.freinet.util.validateFreinetDataTransferPermission
import app.ehrenamtskarte.backend.graphql.getAuthContext
import app.ehrenamtskarte.backend.graphql.shared.context
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
            if (!authContext.admin.mayUpdateFreinetAgencyInformationInRegion(regionId)) {
                throw ForbiddenException()
            }
            val region = RegionsRepository.findRegionById(regionId)

            if (dataTransferActivated) {
                validateFreinetDataTransferPermission(context.backendConfiguration.environment, region.name)
            }
            val freinetAgency = FreinetAgencyRepository.getFreinetAgencyByRegionId(regionId)
                ?: throw FreinetAgencyNotFoundException()
            FreinetAgencyRepository.updateFreinetDataTransfer(freinetAgency, dataTransferActivated)
        }
        return true
    }
}
