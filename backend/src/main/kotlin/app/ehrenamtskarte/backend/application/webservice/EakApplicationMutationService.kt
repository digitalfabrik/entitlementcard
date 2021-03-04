package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.database.schema.repos.EakApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.EakApplication
import app.ehrenamtskarte.backend.verification.database.repos.CardRepository
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardGenerationModel
import com.expediagroup.graphql.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.transactions.transaction
import org.postgresql.util.Base64
import java.time.LocalDateTime
import java.time.ZoneOffset


@Suppress("unused")
class EakApplicationMutationService {
    @GraphQLDescription("Stores a new digital EAK")
    fun addEakApplication(eakApplication: EakApplication): Boolean {
        transaction {
            EakApplicationRepository.addEakApplication(eakApplication)
        }
        return true
    }
}
