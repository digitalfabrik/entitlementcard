package app.ehrenamtskarte.backend.graphql.stores.types

data class SearchParams(
    val searchText: String?,
    val categoryIds: List<Int>?,
    val coordinates: Coordinates?,
    val limit: Int?,
    val offset: Long?,
)
