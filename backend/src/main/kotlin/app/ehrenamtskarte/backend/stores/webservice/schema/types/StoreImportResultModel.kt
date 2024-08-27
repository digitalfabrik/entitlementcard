package app.ehrenamtskarte.backend.stores.webservice.schema.types

data class StoreImportResultModel(
    val storesCreated: Int,
    val storesDeleted: Int,
    val storesUntouched: Int
)
