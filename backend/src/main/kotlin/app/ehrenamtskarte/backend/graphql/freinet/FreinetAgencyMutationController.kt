package app.ehrenamtskarte.backend.graphql.freinet

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.db.entities.mayUpdateFreinetAgencyInformationInRegion
import app.ehrenamtskarte.backend.db.repositories.FreinetAgencyRepository
import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.graphql.auth.requireAuthContext
import app.ehrenamtskarte.backend.graphql.exceptions.NotImplementedException
import app.ehrenamtskarte.backend.graphql.freinet.exceptions.FreinetAgencyNotFoundException
import app.ehrenamtskarte.backend.graphql.freinet.util.validateFreinetDataTransferPermission
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.stereotype.Controller

@Controller
class FreinetAgencyMutationController(
    private val backendConfiguration: BackendConfiguration,
) {
    @GraphQLDescription("Updates the data transfer to freinet. Works only for the EAK project.")
    @MutationMapping
    fun updateDataTransferToFreinet(
        dfe: DataFetchingEnvironment,
        @Argument regionId: Int,
        @Argument dataTransferActivated: Boolean,
    ): Boolean {
        val authContext = dfe.requireAuthContext()
        val projectConfig = backendConfiguration.getProjectConfig(authContext.project)

        if (projectConfig.freinet == null) {
            throw NotImplementedException("Freinet is not configured in this project")
        }

        transaction {
            if (!authContext.admin.mayUpdateFreinetAgencyInformationInRegion(regionId)) {
                throw ForbiddenException()
            }
            val region = RegionsRepository.findRegionById(regionId)

            if (dataTransferActivated) {
                validateFreinetDataTransferPermission(backendConfiguration.environment, region.name)
            }
            val freinetAgency = FreinetAgencyRepository.getFreinetAgencyByRegionId(regionId)
                ?: throw FreinetAgencyNotFoundException()
            FreinetAgencyRepository.updateFreinetDataTransfer(freinetAgency, dataTransferActivated)
        }
        return true
    }
}
