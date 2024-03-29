package app.ehrenamtskarte.backend.auth.webservice.dataloader

import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Administrator
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import app.ehrenamtskarte.backend.common.webservice.newNamedDataLoader
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
