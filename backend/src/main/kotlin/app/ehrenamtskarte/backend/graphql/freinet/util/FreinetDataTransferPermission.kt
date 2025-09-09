package app.ehrenamtskarte.backend.graphql.freinet.util

import app.ehrenamtskarte.backend.graphql.shared.FREINET_DEMO_REGION_NAME
import app.ehrenamtskarte.backend.config.Environment
import app.ehrenamtskarte.backend.graphql.freinet.exceptions.FreinetDataTransferNotPermittedException

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
