package app.ehrenamtskarte.backend.stores.webservice.schema.types

data class StoreImportResultModel(
    val storesCreated: Int,
    val storesToDelete: MutableSet<Int>,
    val storesUntouched: Int
)
