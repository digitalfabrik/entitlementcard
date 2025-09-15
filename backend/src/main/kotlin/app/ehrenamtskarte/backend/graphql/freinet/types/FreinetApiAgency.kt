package app.ehrenamtskarte.backend.graphql.freinet.types

data class FreinetApiAgency(
    val officialRegionalKeys: List<String>,
    val agencyId: Int,
    val agencyName: String,
    val apiAccessKey: String,
) {
    fun hasRegionKey(regionKey: String): Boolean = officialRegionalKeys.any { it.startsWith(regionKey) }
}
