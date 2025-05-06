package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.auth.getAdministrator
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.utils.Environment
import app.ehrenamtskarte.backend.common.webservice.KOBLENZ_PEPPER_SYS_ENV
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.NotImplementedException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class ViewPepperQueryService {
    @GraphQLDescription("Get the pepper for Koblenz user hashing")
    fun getHashingPepper(dfe: DataFetchingEnvironment): String {
        val context = dfe.graphQlContext.context
        val admin = context.getAdministrator()

        return transaction {
            if (!Authorizer.mayViewHashingPepper(admin)) {
                throw ForbiddenException()
            }
            Environment.getVariable(KOBLENZ_PEPPER_SYS_ENV)
                ?: throw NotImplementedException("Koblenz pepper is not set properly in this environment")
        }
    }
}
