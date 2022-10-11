package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.database.EakApplicationEntity
import app.ehrenamtskarte.backend.application.database.repos.EakApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.create.BlueCardApplication
import app.ehrenamtskarte.backend.application.webservice.schema.create.GoldenCardApplication
import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.service.Authorizer.mayDeleteApplicationsInRegion
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.common.webservice.UnauthorizedException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment

@Suppress("unused")
class EakApplicationMutationService {

    @GraphQLDescription("Stores a new blue digital EAK")
    fun addBlueEakApplication(
        regionId: Int,
        application: BlueCardApplication,
        dfe: DataFetchingEnvironment
    ): Boolean {
        val context = dfe.getLocalContext<GraphQLContext>()
        EakApplicationRepository.addEakApplication(
            regionId,
            application,
            context,
            EakApplicationRepository::validateBlueApplication
        )
        return true
    }

    @GraphQLDescription("Stores a new golden digital EAK")
    fun addGoldenEakApplication(
        regionId: Int,
        application: GoldenCardApplication,
        dfe: DataFetchingEnvironment
    ): Boolean {
        val context = dfe.getLocalContext<GraphQLContext>()
        EakApplicationRepository.addEakApplication(
            regionId,
            application,
            context,
            EakApplicationRepository::validateGoldenApplication
        )
        return true
    }

    @GraphQLDescription("Deletes the application with specified id")
    fun deleteApplication(
        applicationId: Int,
        dfe: DataFetchingEnvironment
    ): Boolean {
        val context = dfe.getLocalContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()

        val application = EakApplicationEntity.findById(applicationId) ?: throw UnauthorizedException()
        // We throw an UnauthorizedException here, as we do not know whether there was an application with id
        // `applicationId` and whether this application was contained in the user's project & region.

        val user = AdministratorEntity.findById(jwtPayload.userId)
        if (!mayDeleteApplicationsInRegion(user, application.regionId.value)) {
            throw UnauthorizedException()
        }

        return EakApplicationRepository.delete(applicationId, context)
    }
}
