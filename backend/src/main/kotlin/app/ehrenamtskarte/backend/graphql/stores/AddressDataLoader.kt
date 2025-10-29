package app.ehrenamtskarte.backend.graphql.stores

import app.ehrenamtskarte.backend.db.repositories.AddressRepository
import app.ehrenamtskarte.backend.graphql.BaseDataLoader
import app.ehrenamtskarte.backend.graphql.stores.types.Address
import org.springframework.stereotype.Component

@Component
class AddressDataLoader : BaseDataLoader<Int, Address>() {
    override fun loadBatch(keys: List<Int>): Map<Int, Address> =
        AddressRepository.findByIds(keys)
            .mapNotNull { it?.let { address -> address.id.value to Address.fromDbEntity(address) } }
            .toMap()
}
