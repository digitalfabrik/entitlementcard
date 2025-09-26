package app.ehrenamtskarte.backend.graphql.auth.types

import app.ehrenamtskarte.backend.db.entities.ApiTokenType

class ApiTokenMetaData(
    val id: Int,
    val creatorEmail: String,
    val expirationDate: String,
    val type: ApiTokenType,
)
