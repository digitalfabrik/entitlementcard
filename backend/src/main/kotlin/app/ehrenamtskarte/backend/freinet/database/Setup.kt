package app.ehrenamtskarte.backend.freinet.database

import app.ehrenamtskarte.backend.freinet.webservice.schema.types.FreinetApiAgency
import app.ehrenamtskarte.backend.regions.database.RegionEntity
import org.jetbrains.exposed.sql.SizedIterable

fun insertOrUpdateFreinetRegionInformation(
    agency: FreinetApiAgency,
    dbFreinetRegionInformation: SizedIterable<FreinetAgenciesEntity>,
    regionEntity: RegionEntity,
) {
    val dbAgency = dbFreinetRegionInformation.find { it.agencyId == agency.agencyId }
    if (dbAgency == null) {
        FreinetAgenciesEntity.new {
            regionId = regionEntity.id
            agencyId = agency.agencyId
            agencyName = agency.agencyName
            apiAccessKey = agency.apiAccessKey
        }
    } else {
        dbAgency.agencyId = agency.agencyId
        dbAgency.agencyName = agency.agencyName
        dbAgency.apiAccessKey = agency.apiAccessKey
    }
}
