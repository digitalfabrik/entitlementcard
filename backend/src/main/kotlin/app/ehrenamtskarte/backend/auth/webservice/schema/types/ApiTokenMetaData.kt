package app.ehrenamtskarte.backend.auth.webservice.schema.types

import app.ehrenamtskarte.backend.auth.database.ApiTokenType

class ApiTokenMetaData(
    val id: Int,
    val creatorEmail: String,
    val expirationDate: String,
    val type: ApiTokenType,
)
