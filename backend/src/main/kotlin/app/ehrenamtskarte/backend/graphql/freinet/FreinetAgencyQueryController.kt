package app.ehrenamtskarte.backend.graphql.freinet

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.db.entities.mayViewFreinetAgencyInformationInRegion
import app.ehrenamtskarte.backend.db.repositories.FreinetAgencyRepository
import app.ehrenamtskarte.backend.graphql.auth.requireAuthContext
import app.ehrenamtskarte.backend.graphql.exceptions.NotImplementedException
import app.ehrenamtskarte.backend.graphql.freinet.types.FreinetAgency
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller

@Controller
class FreinetAgencyQueryController(
    private val backendConfiguration: BackendConfiguration,
) {
    @GraphQLDescription(
        "Returns freinet agency information for a particular region. Works only for the EAK project.",
    )
    @QueryMapping
    fun getFreinetAgencyByRegionId(
        dfe: DataFetchingEnvironment,
        @Argument regionId: Int,
    ): FreinetAgency? =
        transaction {
            val authContext = dfe.requireAuthContext()
            val projectConfig = backendConfiguration.getProjectConfig(authContext.project)

            if (projectConfig.freinet == null) {
                throw NotImplementedException("Freinet is not configured in this project")
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
