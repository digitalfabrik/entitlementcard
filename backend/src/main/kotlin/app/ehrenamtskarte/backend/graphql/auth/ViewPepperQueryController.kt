package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.db.entities.mayViewHashingPepper
import app.ehrenamtskarte.backend.graphql.exceptions.NotImplementedException
import app.ehrenamtskarte.backend.graphql.shared.KOBLENZ_PEPPER_SYS_ENV
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import app.ehrenamtskarte.backend.shared.utils.Environment
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller

@Controller
class ViewPepperQueryController {
    @GraphQLDescription("Get the pepper for Koblenz user hashing")
    @QueryMapping
    fun getHashingPepper(dfe: DataFetchingEnvironment): String {
        val admin = dfe.requireAuthContext().admin

        return transaction {
            if (!admin.mayViewHashingPepper()) {
                throw ForbiddenException()
            }
            Environment.Companion.getVariable(KOBLENZ_PEPPER_SYS_ENV)
                ?: throw NotImplementedException("Koblenz pepper is not set properly in this environment")
        }
    }
}
