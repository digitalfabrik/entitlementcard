package app.ehrenamtskarte.backend.freinet.database.repos

import app.ehrenamtskarte.backend.db.entities.FreinetAgencies
import app.ehrenamtskarte.backend.db.entities.FreinetAgenciesEntity

object FreinetAgencyRepository {
    fun getFreinetAgencyByRegionId(regionId: Int): FreinetAgenciesEntity? =
        FreinetAgenciesEntity.find { FreinetAgencies.regionId eq regionId }.singleOrNull()

    fun updateFreinetDataTransfer(freinetAgency: FreinetAgenciesEntity, dataTransferActivated: Boolean) {
        freinetAgency.dataTransferActivated = dataTransferActivated
    }
}
