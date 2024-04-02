package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.database.ApplicationEntity
import app.ehrenamtskarte.backend.application.database.repos.ApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.view.ApplicationVerificationView
import app.ehrenamtskarte.backend.application.webservice.schema.view.ApplicationView
import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
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
        val jwtPayload = context.enforceSignedIn()
        return transaction {
            val user = AdministratorEntity.findById(jwtPayload.adminId)
                ?: throw UnauthorizedException()
            if (!Authorizer.mayViewApplicationsInRegion(user, regionId)) {
                throw ForbiddenException()
            }

            ApplicationRepository.getApplications(regionId)
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

    @GraphQLDescription("Queries an application by application accessKey")
    fun getApplicationByApplicationVerificationAccessKey(
        applicationVerificationAccessKey: String
    ): ApplicationView {
        return transaction {
            ApplicationRepository.getApplicationByApplicationVerificationAccessKey(applicationVerificationAccessKey)
        }
    }

    @GraphQLDescription("Queries an application verification by application accessKey")
    fun getApplicationVerification(
        accessKey: String
    ): ApplicationVerificationView {
        return transaction {
            ApplicationRepository.getApplicationVerification(accessKey).let {
                ApplicationVerificationView.fromDbEntity(it)
            }
        }
    }

    @GraphQLDescription("Queries an application by id")
    fun getApplicationById(
        applicationId: Int,
        dfe: DataFetchingEnvironment
    ): ApplicationView {
        val context = dfe.getContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()

        return transaction {
            val application = ApplicationEntity.findById(applicationId) ?: throw UnauthorizedException()
            // We throw an UnauthorizedException here, as we do not know whether there was an application with id
            // `applicationId` and whether this application was contained in the user's project & region.

            val user = AdministratorEntity.findById(jwtPayload.adminId)
                ?: throw UnauthorizedException()

            if (!Authorizer.mayViewApplicationsInRegion(user, application.regionId.value)) {
                throw ForbiddenException()
            }

            ApplicationRepository.getApplicationById(applicationId).let {
                ApplicationView.fromDbEntity(it)
            }
        }
    }
}
