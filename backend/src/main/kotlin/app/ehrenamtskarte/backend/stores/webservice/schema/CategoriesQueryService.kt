package app.ehrenamtskarte.backend.stores.webservice.schema

import app.ehrenamtskarte.backend.db.repositories.CategoriesRepository
import app.ehrenamtskarte.backend.stores.webservice.schema.types.Category
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class CategoriesQueryService {
    @GraphQLDescription("Return list of all categories.")
    fun categories(): List<Category> =
        transaction {
            CategoriesRepository.findAll().map {
                Category(it.id.value, it.name)
            }
        }
}
