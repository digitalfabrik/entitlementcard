package xyz.elitese.ehrenamtskarte.importer

import com.beust.klaxon.Json

data class FreinetData(
        @Json("fileinfo")
        val fileInfo: String,
        @Json("data")
        val data: List<FreinetAcceptingStore>
)
