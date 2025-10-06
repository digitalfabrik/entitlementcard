package app.ehrenamtskarte.backend.graphql.regions

import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.graphql.BaseDataLoader
import app.ehrenamtskarte.backend.graphql.regions.types.Region
import org.springframework.stereotype.Component

@Component
class RegionDataLoader : BaseDataLoader<Int, Region>() {
    override fun loadBatch(keys: List<Int>): Map<Int, Region> =
        RegionsRepository.findByIds(keys)
            .mapNotNull { it?.let { it.id.value to Region.fromDbEntity(it) } }
            .toMap()
}
