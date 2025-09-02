package app.ehrenamtskarte.backend.db.setup

import app.ehrenamtskarte.backend.common.webservice.EAK_BAYERN_PROJECT
import app.ehrenamtskarte.backend.common.webservice.FREINET_DEMO_REGION_NAME
import app.ehrenamtskarte.backend.common.webservice.KOBLENZ_PASS_PROJECT
import app.ehrenamtskarte.backend.common.webservice.NUERNBERG_PASS_PROJECT
import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.config.Environment
import app.ehrenamtskarte.backend.db.entities.FreinetAgenciesEntity
import app.ehrenamtskarte.backend.graphql.freinet.schema.types.FreinetApiAgency
import app.ehrenamtskarte.backend.db.entities.ProjectEntity
import app.ehrenamtskarte.backend.db.entities.RegionEntity
import app.ehrenamtskarte.backend.regions.database.EAK_BAYERN_REGIONS
import org.jetbrains.exposed.sql.transactions.transaction

fun insertOrUpdateRegions(agencies: List<FreinetApiAgency>, config: BackendConfiguration) {
    val projects = ProjectEntity.all()
    val dbRegions = RegionEntity.all()
    val dbFreinetRegionInformation = FreinetAgenciesEntity.all()

    fun createOrUpdateRegion(
        regionProjectId: String,
        regionName: String,
        regionPrefix: String,
        regionKey: String,
        regionWebsite: String,
        regionActivatedForApplication: Boolean,
    ) {
        val project = projects.firstOrNull { it.project == regionProjectId }
            ?: throw Error("Required project '$regionProjectId' not found!")
        val region = dbRegions.singleOrNull { it.projectId == project.id }
        if (region == null) {
            RegionEntity.new {
                projectId = project.id
                name = regionName
                prefix = regionPrefix
                regionIdentifier = regionKey
                website = regionWebsite
                activatedForApplication = regionActivatedForApplication
            }
        } else {
            region.name = regionName
            region.prefix = regionPrefix
            region.website = regionWebsite
            region.regionIdentifier = regionKey
            region.activatedForApplication = regionActivatedForApplication
        }
    }

    transaction {
        val eakProject = projects.firstOrNull { it.project == EAK_BAYERN_PROJECT }
            ?: throw Error("Required project '$EAK_BAYERN_PROJECT' not found!")
        val eakRegions = EAK_BAYERN_REGIONS.toMutableList()
        if (config.environment != Environment.PRODUCTION) {
            eakRegions.add(listOf("Stadt", FREINET_DEMO_REGION_NAME, "00000", "https://dummy"))
        }
        eakRegions.forEach { (prefix, name, regionIdentifier, website) ->
            val regionEntity = dbRegions.find {
                it.regionIdentifier == regionIdentifier && it.projectId == eakProject.id
            }?.apply {
                this.name = name
                this.prefix = prefix
                this.website = website
            } ?: RegionEntity.new {
                projectId = eakProject.id
                this.name = name
                this.prefix = prefix
                this.regionIdentifier = regionIdentifier
                this.website = website
            }
            agencies.find { it.hasRegionKey(regionIdentifier) }?.let { agency ->
                insertOrUpdateFreinetRegionInformation(agency, dbFreinetRegionInformation, regionEntity)
            }
        }
        createOrUpdateRegion(
            NUERNBERG_PASS_PROJECT,
            "Nürnberg",
            "Stadt",
            "09564",
            "https://nuernberg.de",
            false,
        )
        createOrUpdateRegion(
            KOBLENZ_PASS_PROJECT,
            "Koblenz",
            "Stadt",
            "07111",
            "https://koblenz.de/",
            false,
        )
    }
}
