package app.ehrenamtskarte.backend.graphql.application

import app.ehrenamtskarte.backend.db.entities.mayViewApplicationsInRegion
import app.ehrenamtskarte.backend.db.repositories.ApplicationRepository
import app.ehrenamtskarte.backend.graphql.application.types.ApplicationAdminGql
import app.ehrenamtskarte.backend.graphql.application.types.ApplicationPublicGql
import app.ehrenamtskarte.backend.graphql.application.types.ApplicationVerificationView
import app.ehrenamtskarte.backend.graphql.auth.requireAuthContext
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidLinkException
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller

@Controller
class EakApplicationQueryController {
    @GraphQLDescription("Queries all applications for a specific region")
    @QueryMapping
    fun getApplications(
        dfe: DataFetchingEnvironment,
        @Argument regionId: Int,
    ): List<ApplicationAdminGql> {
        val admin = dfe.requireAuthContext().admin
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
    @QueryMapping
    fun getApplicationByApplicant(
        @Argument accessKey: String,
    ): ApplicationPublicGql =
        transaction {
            ApplicationRepository.getApplicationByApplicant(accessKey)
                ?.let { ApplicationPublicGql.fromDbEntity(it) }
                ?: throw InvalidLinkException()
        }

    @GraphQLDescription("Queries an application by application verification accessKey")
    @QueryMapping
    fun getApplicationByApplicationVerificationAccessKey(
        @Argument applicationVerificationAccessKey: String,
    ): ApplicationPublicGql =
        transaction {
            ApplicationRepository
                .getApplicationByApplicationVerificationAccessKey(applicationVerificationAccessKey)
                ?.let { ApplicationPublicGql.fromDbEntity(it) }
                ?: throw InvalidLinkException()
        }

    @GraphQLDescription("Queries an application verification by application verification accessKey")
    @QueryMapping
    fun getApplicationVerification(
        @Argument applicationVerificationAccessKey: String,
    ): ApplicationVerificationView =
        transaction {
            ApplicationRepository.getApplicationVerification(applicationVerificationAccessKey).let {
                ApplicationVerificationView.fromDbEntity(it)
            }
        }
}
