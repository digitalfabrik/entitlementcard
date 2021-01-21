package xyz.elitese.ehrenamtskarte.stores.webservice.schema

import com.expediagroup.graphql.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.transactions.transaction
import xyz.elitese.ehrenamtskarte.stores.database.repos.CategoriesRepository
import xyz.elitese.ehrenamtskarte.stores.webservice.schema.types.Category

@Suppress("unused")
class CategoriesQueryService {

    @GraphQLDescription("Return list of all categories.")
    fun categories(): List<Category> = transaction {
        CategoriesRepository.findAll().map {
            Category(it.id.value, it.name)
        }
    }
}
