package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.database.ApplicationEntity
import app.ehrenamtskarte.backend.application.database.repos.ApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.create.Application
import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.service.Authorizer.mayDeleteApplicationsInRegion
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.common.webservice.UnauthorizedException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class EakApplicationMutationService {

    @GraphQLDescription("Stores a new application for an EAK")
    fun addEakApplication(
        regionId: Int,
        application: Application,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val context = dfe.getContext<GraphQLContext>()
        // Validate that all files are png, jpeg or pdf files and at most 5MB.
        val allowedContentTypes = setOf("application/pdf", "image/png", "image/jpeg")
        val maxFileSizeBytes = 5 * 1000 * 1000
        if (!context.files.all { it.contentType in allowedContentTypes && it.size <= maxFileSizeBytes }) {
            throw IllegalArgumentException("An uploaded file does not adhere to the file upload requirements.")
        }

        val (applicationEntity, verificationEntities) = ApplicationRepository.persistApplication(
            application.toJsonField(),
            application.extractApplicationVerifications(),
            regionId,
            context.applicationData,
            context.files,
        )

        // TODO: Send mails

        return true
    }

    @GraphQLDescription("Deletes the application with specified id")
    fun deleteApplication(
        applicationId: Int,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val context = dfe.getContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()

        return transaction {
            val application = ApplicationEntity.findById(applicationId) ?: throw UnauthorizedException()
            // We throw an UnauthorizedException here, as we do not know whether there was an application with id
            // `applicationId` and whether this application was contained in the user's project & region.

            val user = AdministratorEntity.findById(jwtPayload.adminId)
                ?: throw IllegalArgumentException("Admin does not exist")
            if (!mayDeleteApplicationsInRegion(user, application.regionId.value)) {
                throw UnauthorizedException()
            }

            ApplicationRepository.delete(applicationId, context)
        }
    }

    @GraphQLDescription("Withdraws the application")
    fun withdrawApplication(accessKey: String): Boolean {
        return transaction {
            ApplicationRepository.withdrawApplication(accessKey)
        }
    }

    @GraphQLDescription("Verifies or rejects an application verification")
    fun verifyOrRejectApplicationVerification(
        accessKey: String,
        verified: Boolean
    ): Boolean {
        return transaction {
            if (verified) {
                ApplicationRepository.verifyApplicationVerification(accessKey)
            } else {
                ApplicationRepository.rejectApplicationVerification(accessKey)
            }
        }
    }
}
