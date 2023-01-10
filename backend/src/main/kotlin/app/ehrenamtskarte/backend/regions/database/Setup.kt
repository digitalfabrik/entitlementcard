package app.ehrenamtskarte.backend.regions.database

import app.ehrenamtskarte.backend.common.webservice.EAK_BAYERN_PROJECT
import app.ehrenamtskarte.backend.common.webservice.NUERNBERG_PASS_PROJECT
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction

fun setupDatabase() {
    SchemaUtils.create(
        Regions
    )

    transaction {
        val projects = ProjectEntity.all()
        val dbRegions = RegionEntity.all()

        // Create or update eak regions in database
        val eakProject = projects.firstOrNull { it.project == EAK_BAYERN_PROJECT }
            ?: throw Error("Required project '$EAK_BAYERN_PROJECT' not found!")
        EAK_BAYERN_REGIONS.forEach { eakRegion ->
            val dbRegion = dbRegions.find { it.regionIdentifier == eakRegion[2] && it.projectId == eakProject.id }
            if (dbRegion == null) {
                RegionEntity.new {
                    projectId = eakProject.id
                    name = eakRegion[1]
                    prefix = eakRegion[0]
                    regionIdentifier = eakRegion[2]
                    website = eakRegion[3]
                }
            } else {
                dbRegion.name = eakRegion[1]
                dbRegion.prefix = eakRegion[0]
                dbRegion.website = eakRegion[3]
            }
        }

        // Create or update nuernberg region in database
        val nuernbergPassProject = projects.firstOrNull { it.project == NUERNBERG_PASS_PROJECT }
            ?: throw Error("Required project '$NUERNBERG_PASS_PROJECT' not found!")
        val nuernbergRegion = dbRegions.singleOrNull { it.projectId == nuernbergPassProject.id }
        if (nuernbergRegion == null) {
            RegionEntity.new {
                projectId = nuernbergPassProject.id
                name = "Nürnberg"
                prefix = "Stadt"
                regionIdentifier = null
                website = "https://nuernberg.de"
            }
        } else {
            nuernbergRegion.name = "Nürnberg"
            nuernbergRegion.prefix = "Stadt"
            nuernbergRegion.website = "https://nuernberg.de"
        }
    }
}
