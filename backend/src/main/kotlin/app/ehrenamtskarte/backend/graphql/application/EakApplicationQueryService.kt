package app.ehrenamtskarte.backend.graphql.application

import app.ehrenamtskarte.backend.db.entities.mayViewApplicationsInRegion
import app.ehrenamtskarte.backend.db.repositories.ApplicationRepository
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidLinkException
import app.ehrenamtskarte.backend.graphql.application.schema.view.ApplicationAdminGql
import app.ehrenamtskarte.backend.graphql.application.schema.view.ApplicationPublicGql
import app.ehrenamtskarte.backend.graphql.application.schema.view.ApplicationVerificationView
import app.ehrenamtskarte.backend.graphql.getAuthContext
import app.ehrenamtskarte.backend.shared.webservice.context
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class EakApplicationQueryService {
    @GraphQLDescription("Queries all applications for a specific region")
    fun getApplications(dfe: DataFetchingEnvironment, regionId: Int): List<ApplicationAdminGql> {
        val admin = dfe.graphQlContext.context.getAuthContext().admin

        return transaction {
            if (admin.mayViewApplicationsInRegion(regionId)) {
                ApplicationRepository.getApplicationsByAdmin(regionId)
                    .map { ApplicationAdminGql.fromDbEntity(it) }
            } else {
                throw ForbiddenException()
            }
        }
    }

    @GraphQLDescription("Queries an application by application accessKey")
    fun getApplicationByApplicant(accessKey: String): ApplicationPublicGql =
        transaction {
            ApplicationRepository.getApplicationByApplicant(accessKey)
                ?.let { ApplicationPublicGql.fromDbEntity(it) }
                ?: throw InvalidLinkException()
        }

    @GraphQLDescription("Queries an application by application verification accessKey")
    fun getApplicationByApplicationVerificationAccessKey(
        applicationVerificationAccessKey: String,
    ): ApplicationPublicGql =
        transaction {
            ApplicationRepository
                .getApplicationByApplicationVerificationAccessKey(applicationVerificationAccessKey)
                ?.let { ApplicationPublicGql.fromDbEntity(it) }
                ?: throw InvalidLinkException()
        }

    @GraphQLDescription("Queries an application verification by application verification accessKey")
    fun getApplicationVerification(applicationVerificationAccessKey: String): ApplicationVerificationView =
        transaction {
            ApplicationRepository.getApplicationVerification(applicationVerificationAccessKey).let {
                ApplicationVerificationView.fromDbEntity(it)
            }
        }
}
