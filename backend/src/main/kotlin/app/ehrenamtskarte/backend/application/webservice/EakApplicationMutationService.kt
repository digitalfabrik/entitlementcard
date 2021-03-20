package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.database.repos.EakApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.create.BlueCardApplication
import app.ehrenamtskarte.backend.application.webservice.schema.create.GoldenEakCardApplication
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import com.expediagroup.graphql.annotations.GraphQLDescription

@Suppress("unused")
class EakApplicationMutationService {

    @GraphQLDescription("Stores a new blue digital EAK")
    fun addBlueEakApplication(
        regionId: Int,
        application: BlueCardApplication,
        graphQLContext: GraphQLContext
    ): Boolean {
        EakApplicationRepository.addBlueEakApplication(regionId, application, graphQLContext)
        return true
    }

    @GraphQLDescription("Stores a new golden digital EAK")
    fun addGoldenEakApplication(
        regionId: Int,
        application: GoldenEakCardApplication,
        graphQLContext: GraphQLContext
    ): Boolean {
        EakApplicationRepository.addGoldenEakApplication(regionId, application, graphQLContext)
        return true
    }

}
