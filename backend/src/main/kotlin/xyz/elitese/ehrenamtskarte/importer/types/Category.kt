package xyz.elitese.ehrenamtskarte.importer.types

import com.beust.klaxon.Json

data class Category (
        @Json("id")
        val id: Int,
        @Json("name")
        val name: String
)