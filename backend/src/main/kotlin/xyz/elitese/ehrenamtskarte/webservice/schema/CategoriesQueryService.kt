package xyz.elitese.ehrenamtskarte.webservice.schema

import com.expediagroup.graphql.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.transactions.transaction
import xyz.elitese.ehrenamtskarte.database.repos.CategoriesRepository
import xyz.elitese.ehrenamtskarte.webservice.schema.types.Category

@Suppress("unused")
class CategoriesQueryService {

    @GraphQLDescription("Return list of all categories.")
    fun categories(): List<Category> = transaction {
        CategoriesRepository.findAll().map {
            Category(it.id.value, it.name)
        }
    }
}
