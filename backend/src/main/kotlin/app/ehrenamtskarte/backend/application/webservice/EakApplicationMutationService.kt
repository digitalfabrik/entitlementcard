package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.database.repos.EakApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.create.BlueCardApplication
import app.ehrenamtskarte.backend.application.webservice.schema.create.GoldenEakCardApplication
import com.expediagroup.graphql.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment

@Suppress("unused")
class EakApplicationMutationService {

    @GraphQLDescription("Stores a new blue digital EAK")
    fun addBlueEakApplication(
        regionId: Int,
        application: BlueCardApplication,
        dataFetchingEnvironment: DataFetchingEnvironment
    ): Boolean {
        EakApplicationRepository.addBlueEakApplication(regionId, application, dataFetchingEnvironment)
        return true
    }

    @GraphQLDescription("Stores a new golden digital EAK")
    fun addGoldenEakApplication(
        regionId: Int,
        application: GoldenEakCardApplication,
        dataFetchingEnvironment: DataFetchingEnvironment
    ): Boolean {
        EakApplicationRepository.addGoldenEakApplication(regionId, application, dataFetchingEnvironment)
        return true
    }

}
