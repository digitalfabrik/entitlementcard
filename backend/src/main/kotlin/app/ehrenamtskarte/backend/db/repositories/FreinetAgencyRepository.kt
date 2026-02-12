package app.ehrenamtskarte.backend.db.repositories

import app.ehrenamtskarte.backend.db.entities.FreinetAgencies
import app.ehrenamtskarte.backend.db.entities.FreinetAgenciesEntity
import org.jetbrains.exposed.v1.core.eq

object FreinetAgencyRepository {
    fun getFreinetAgencyByRegionId(regionId: Int): FreinetAgenciesEntity? =
        FreinetAgenciesEntity.find { FreinetAgencies.regionId eq regionId }.singleOrNull()

    fun updateFreinetDataTransfer(freinetAgency: FreinetAgenciesEntity, dataTransferActivated: Boolean) {
        freinetAgency.dataTransferActivated = dataTransferActivated
    }
}
