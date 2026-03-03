package app.ehrenamtskarte.backend.db.setup

import app.ehrenamtskarte.backend.db.entities.FreinetAgenciesEntity
import app.ehrenamtskarte.backend.db.entities.RegionEntity
import app.ehrenamtskarte.backend.graphql.freinet.types.FreinetApiAgency

fun insertOrUpdateFreinetRegionInformation(
    agency: FreinetApiAgency,
    freinetRegionAgencyEntity: FreinetAgenciesEntity?,
    regionEntity: RegionEntity,
) {
    if (freinetRegionAgencyEntity == null) {
        FreinetAgenciesEntity.new {
            regionId = regionEntity.id
            agencyId = agency.agencyId
            agencyName = agency.agencyName
            apiAccessKey = agency.apiAccessKey
        }
    } else {
        freinetRegionAgencyEntity.agencyId = agency.agencyId
        freinetRegionAgencyEntity.agencyName = agency.agencyName
        freinetRegionAgencyEntity.apiAccessKey = agency.apiAccessKey
    }
}
