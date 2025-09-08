package app.ehrenamtskarte.backend.graphql.auth.schema

import app.ehrenamtskarte.backend.db.entities.mayViewHashingPepper
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.NotImplementedException
import app.ehrenamtskarte.backend.graphql.getAuthContext
import app.ehrenamtskarte.backend.shared.utils.Environment
import app.ehrenamtskarte.backend.shared.webservice.KOBLENZ_PEPPER_SYS_ENV
import app.ehrenamtskarte.backend.shared.webservice.context
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class ViewPepperQueryService {
    @GraphQLDescription("Get the pepper for Koblenz user hashing")
    fun getHashingPepper(dfe: DataFetchingEnvironment): String {
        val context = dfe.graphQlContext.context
        val admin = context.getAuthContext().admin

        return transaction {
            if (!admin.mayViewHashingPepper()) {
                throw ForbiddenException()
            }
            Environment.getVariable(KOBLENZ_PEPPER_SYS_ENV)
                ?: throw NotImplementedException("Koblenz pepper is not set properly in this environment")
        }
    }
}
