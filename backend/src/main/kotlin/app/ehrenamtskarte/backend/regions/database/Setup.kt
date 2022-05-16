package app.ehrenamtskarte.backend.regions.database

import app.ehrenamtskarte.backend.common.webservice.EAK_BAYERN_PROJECT
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

        // Create a dummy region for each project to save the stores to
        projects.forEach { project ->
            // Project ids and therefore the dummy regions should never change
            // Therefore, we only need to create the dummy region if it does not already exist
            if (dbRegions.none { it.name == project.project }) {
                // TODO #538: Perhaps no dummy region will be needed anymore
                RegionEntity.new {
                    projectId = project.id
                    name = project.project
                    prefix = ""
                    regionIdentifier = null
                    website = ""
                }
            }
        }

        // Create or update eak regions in database
        val eakProject = projects.firstOrNull { it.project == EAK_BAYERN_PROJECT }
            ?: throw Error("Required project '$EAK_BAYERN_PROJECT' not found!")
        EAK_BAYERN_REGIONS.forEach { eakRegion ->
            val dbRegion = dbRegions.find { it.regionIdentifier == eakRegion[2] }
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
    }
}
