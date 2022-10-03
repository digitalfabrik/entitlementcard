package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.database.EakApplicationEntity
import app.ehrenamtskarte.backend.application.database.repos.EakApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.create.BlueCardApplication
import app.ehrenamtskarte.backend.application.webservice.schema.create.GoldenEakCardApplication
import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.service.Authorizer.mayDeleteApplicationsInRegion
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.common.webservice.UnauthorizedException
import com.expediagroup.graphql.annotations.GraphQLDescription

@Suppress("unused")
class EakApplicationMutationService {

    @GraphQLDescription("Stores a new blue digital EAK")
    fun addBlueEakApplication(
        regionId: Int, application: BlueCardApplication, graphQLContext: GraphQLContext
    ): Boolean {
        EakApplicationRepository.addEakApplication(
            regionId, application, graphQLContext, EakApplicationRepository::validateBlueApplication
        )
        return true
    }

    @GraphQLDescription("Stores a new golden digital EAK")
    fun addGoldenEakApplication(
        regionId: Int, application: GoldenEakCardApplication, graphQLContext: GraphQLContext
    ): Boolean {
        EakApplicationRepository.addEakApplication(
            regionId, application, graphQLContext, EakApplicationRepository::validateGoldenApplication
        )
        return true
    }

    @GraphQLDescription("Deletes the application with specified id")
    fun deleteApplication(
        context: GraphQLContext, applicationId: Int
    ): Boolean {
        val jwtPayload = context.enforceSignedIn()

        // We throw an UnauthorizedException here, as we do not know whether there was an application with id
        // `applicationId` and whether this application was contained in the user's project & region.
        val application = EakApplicationEntity.findById(applicationId) ?: throw UnauthorizedException()


        val user = AdministratorEntity.findById(jwtPayload.userId)
        if (!mayDeleteApplicationsInRegion(user, application.regionId.value)) {
            throw UnauthorizedException()
        }

        return EakApplicationRepository.delete(applicationId, context)
    }
}
