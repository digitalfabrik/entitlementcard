package app.ehrenamtskarte.backend.graphql.stores.types

import com.expediagroup.graphql.generator.annotations.GraphQLDescription

@GraphQLDescription("A page of accepting stores matching the search params together with the total number of matches.")
data class AcceptingStoreSearchResult(
    @GraphQLDescription("The accepting stores of the requested page (respecting limit and offset).")
    val stores: List<AcceptingStoreV2>,
    @GraphQLDescription(
        "The total number of accepting stores matching the search params (ignoring limit and offset). " +
            "Only returned for the first page (offset 0), as it does not change when paginating.",
    )
    val totalCount: Int?,
)
