package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.database.repos.ApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.view.ApplicationVerificationView
import app.ehrenamtskarte.backend.application.webservice.schema.view.ApplicationView
import app.ehrenamtskarte.backend.auth.getAuthContext
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidLinkException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class EakApplicationQueryService {
    @GraphQLDescription("Queries all applications for a specific region")
    fun getApplications(dfe: DataFetchingEnvironment, regionId: Int): List<ApplicationView> {
        val authContext = dfe.graphQlContext.context.getAuthContext()

        return transaction {
            if (Authorizer.mayViewApplicationsInRegion(authContext.admin, regionId)) {
                ApplicationRepository.getApplicationsByAdmin(regionId).map { ApplicationView.fromDbEntity(it, true) }
            } else {
                throw ForbiddenException()
            }
        }
    }

    @GraphQLDescription("Queries an application by application accessKey")
    fun getApplicationByApplicant(accessKey: String): ApplicationView =
        transaction {
            ApplicationRepository.getApplicationByApplicant(accessKey)
                ?.let { ApplicationView.fromDbEntity(it) }
                ?: throw InvalidLinkException()
        }

    @GraphQLDescription("Queries an application by application verification accessKey")
    fun getApplicationByApplicationVerificationAccessKey(applicationVerificationAccessKey: String): ApplicationView =
        transaction {
            ApplicationRepository
                .getApplicationByApplicationVerificationAccessKey(applicationVerificationAccessKey)
                ?.let { ApplicationView.fromDbEntity(it) }
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
