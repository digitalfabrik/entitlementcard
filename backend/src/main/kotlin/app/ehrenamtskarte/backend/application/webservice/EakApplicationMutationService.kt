package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.database.schema.repos.EakApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.PersonalEakApplication
import com.expediagroup.graphql.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.transactions.transaction


@Suppress("unused")
class EakApplicationMutationService {
    @GraphQLDescription("Stores a new digital EAK")
    fun addEakApplication(eakApplication: PersonalEakApplication): Boolean {
        transaction {
            EakApplicationRepository.addEakApplication(eakApplication)
        }
        return true
    }
}
