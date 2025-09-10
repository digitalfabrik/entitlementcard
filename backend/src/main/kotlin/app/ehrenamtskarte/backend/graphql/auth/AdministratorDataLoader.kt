package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.db.repositories.AdministratorsRepository
import app.ehrenamtskarte.backend.graphql.auth.types.Administrator
import app.ehrenamtskarte.backend.graphql.auth.types.Role
import app.ehrenamtskarte.backend.graphql.newNamedDataLoader
import org.jetbrains.exposed.sql.transactions.transaction

val administratorLoader = newNamedDataLoader("ADMINISTRATOR_LOADER") { ids ->
    transaction {
        AdministratorsRepository.findByIds(ids).map {
            it?.let {
                val role = Role.fromDbValue(it.role)
                Administrator(it.id.value, it.email, it.regionId?.value, role)
            }
        }
    }
}
