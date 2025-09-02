package app.ehrenamtskarte.backend.db.setup

import app.ehrenamtskarte.backend.db.entities.FreinetAgenciesEntity
import app.ehrenamtskarte.backend.graphql.freinet.schema.types.FreinetApiAgency
import app.ehrenamtskarte.backend.db.entities.RegionEntity
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
