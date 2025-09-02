package app.ehrenamtskarte.backend.db.repositories

import app.ehrenamtskarte.backend.db.entities.FreinetAgencies
import app.ehrenamtskarte.backend.db.entities.FreinetAgenciesEntity

object FreinetAgencyRepository {
    fun getFreinetAgencyByRegionId(regionId: Int): FreinetAgenciesEntity? =
        FreinetAgenciesEntity.yfind { FreinetAgencies.regionId eq regionId }.singleOrNull()

    fun updateFreinetDataTransfer(freinetAgency: FreinetAgenciesEntity, dataTransferActivated: Boolean) {
        freinetAgency.dataTransferActivated = dataTransferActivated
    }
}
