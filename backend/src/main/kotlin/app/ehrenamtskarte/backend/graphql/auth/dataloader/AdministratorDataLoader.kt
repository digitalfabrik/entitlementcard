package app.ehrenamtskarte.backend.graphql.auth.dataloader

import app.ehrenamtskarte.backend.graphql.shared.newNamedDataLoader
import app.ehrenamtskarte.backend.db.repositories.AdministratorsRepository
import app.ehrenamtskarte.backend.graphql.auth.schema.types.Administrator
import app.ehrenamtskarte.backend.graphql.auth.schema.types.Role
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
