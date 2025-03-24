package app.ehrenamtskarte.backend.freinet.database.repos

import app.ehrenamtskarte.backend.freinet.database.FreinetAgencies
import app.ehrenamtskarte.backend.freinet.database.FreinetAgenciesEntity

object FreinetAgencyRepository {
    fun getFreinetAgencyByRegionId(regionId: Int): FreinetAgenciesEntity? =
        FreinetAgenciesEntity.find { FreinetAgencies.regionId eq regionId }.singleOrNull()

    fun updateFreinetDataTransfer(
        freinetAgency: FreinetAgenciesEntity,
        dataTransferActivated: Boolean,
    ) {
        freinetAgency.dataTransferActivated = dataTransferActivated
    }
}
