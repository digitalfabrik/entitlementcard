package app.ehrenamtskarte.backend.stores.webservice.schema.types

data class StoreImportReturnResultModel(
    val storesCreated: Int,
    val storesDeleted: Int,
    val storesUntouched: Int,
)
