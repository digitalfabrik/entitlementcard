package app.ehrenamtskarte.backend.freinet.util

import app.ehrenamtskarte.backend.shared.webservice.FREINET_DEMO_REGION_NAME
import app.ehrenamtskarte.backend.config.Environment
import app.ehrenamtskarte.backend.freinet.exceptions.FreinetDataTransferNotPermittedException

/**
 * Validates if Freinet data transfer is permitted for the given environment and region.
 * - Production environment: allowed for all regions.
 * - Non-production environments: only allowed for demo region, because freinet has no staging environment.
 */
fun validateFreinetDataTransferPermission(environment: Environment, regionName: String) {
    if (environment != Environment.PRODUCTION && regionName != FREINET_DEMO_REGION_NAME) {
        throw FreinetDataTransferNotPermittedException()
    }
}
