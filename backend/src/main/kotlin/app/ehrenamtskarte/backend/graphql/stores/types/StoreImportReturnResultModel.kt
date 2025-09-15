package app.ehrenamtskarte.backend.graphql.stores.types

data class StoreImportReturnResultModel(
    val storesCreated: Int,
    val storesDeleted: Int,
    val storesUntouched: Int,
)
