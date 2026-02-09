package app.ehrenamtskarte.backend.graphql.stores

import app.ehrenamtskarte.backend.db.repositories.CategoriesRepository
import app.ehrenamtskarte.backend.graphql.stores.types.Category
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller

@Controller
class CategoriesQueryController {
    @GraphQLDescription("Return list of all categories.")
    @QueryMapping
    fun categories(): List<Category> =
        transaction {
            CategoriesRepository.findAll().map {
                Category(it.id.value, it.name)
            }
        }
}
