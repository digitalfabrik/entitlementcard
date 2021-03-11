package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.database.repos.EakApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.BlueEakCardApplication
import app.ehrenamtskarte.backend.application.webservice.schema.GoldenEakCardApplication
import com.expediagroup.graphql.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class EakApplicationMutationService {

    @GraphQLDescription("Stores a new blue digital EAK")
    fun addBlueEakApplication(application: BlueEakCardApplication): Boolean {
        transaction {
            EakApplicationRepository.addBlueEakApplication(application)
        }
        return true
    }

    @GraphQLDescription("Stores a new golden digital EAK")
    fun addGoldenEakApplication(application: GoldenEakCardApplication): Boolean {
        transaction {
            EakApplicationRepository.addGoldenEakApplication(application)
        }
        return true
    }

}
