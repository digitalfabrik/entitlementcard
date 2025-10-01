package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.db.repositories.AdministratorsRepository
import app.ehrenamtskarte.backend.graphql.BaseDataLoader
import app.ehrenamtskarte.backend.graphql.auth.types.Administrator
import org.springframework.stereotype.Component

@Component
class AdministratorDataLoader : BaseDataLoader<Int, Administrator>(Int::class, Administrator::class) {
    override fun loadBatch(keys: List<Int>): Map<Int, Administrator> =
        AdministratorsRepository.findByIds(keys)
            .mapNotNull { it?.let { it.id.value to Administrator.fromDbEntity(it) } }
            .toMap()
}
