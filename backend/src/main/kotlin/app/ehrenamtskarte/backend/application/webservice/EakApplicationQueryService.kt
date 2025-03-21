package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.database.repos.ApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.view.ApplicationVerificationView
import app.ehrenamtskarte.backend.application.webservice.schema.view.ApplicationView
import app.ehrenamtskarte.backend.auth.getAdministrator
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class EakApplicationQueryService {

    @GraphQLDescription("Queries all applications for a specific region")
    fun getApplications(
        dfe: DataFetchingEnvironment,
        regionId: Int
    ): List<ApplicationView> {
        val context = dfe.getContext<GraphQLContext>()
        val admin = context.getAdministrator()
        return transaction {
            if (!Authorizer.mayViewApplicationsInRegion(admin, regionId)) {
                throw ForbiddenException()
            }

            ApplicationRepository.getApplicationsByAdmin(regionId)
        }
    }

    @GraphQLDescription("Queries an application by application accessKey")
    fun getApplicationByApplicant(
        accessKey: String
    ): ApplicationView {
        return transaction {
            ApplicationRepository.getApplicationByApplicant(accessKey)
        }
    }

    @GraphQLDescription("Queries an application by application verification accessKey")
    fun getApplicationByApplicationVerificationAccessKey(
        applicationVerificationAccessKey: String
    ): ApplicationView {
        return transaction {
            ApplicationRepository.getApplicationByApplicationVerificationAccessKey(applicationVerificationAccessKey)
        }
    }

    @GraphQLDescription("Queries an application verification by application verification accessKey")
    fun getApplicationVerification(
        applicationVerificationAccessKey: String
    ): ApplicationVerificationView {
        return transaction {
            ApplicationRepository.getApplicationVerification(applicationVerificationAccessKey).let {
                ApplicationVerificationView.fromDbEntity(it)
            }
        }
    }
}
