package xyz.elitese.ehrenamtskarte.stores.importer.freinet.types

import com.beust.klaxon.Json
import xyz.elitese.ehrenamtskarte.stores.importer.freinet.annotations.BooleanField
import xyz.elitese.ehrenamtskarte.stores.importer.freinet.annotations.DoubleField
import xyz.elitese.ehrenamtskarte.stores.importer.freinet.annotations.IntegerField

data class FreinetAcceptingStore (
        @IntegerField
        @Json("eak_id")
        var id: Int,
        @Json(name = "eak_dateline")
        val dateline: String = "",
        @IntegerField
        @Json(name = "eak_agentur_id")
        val agencyId: Int? = null,
        @Json(name = "eak_name")
        val name: String = "",
        @Json(name = "eak_vorname")
        val forename: String? = null,
        @Json(name = "eak_nachname")
        val surname: String? = null,
        @Json(name = "eak_strasse")
        val street: String = "",
        @Json(name = "eak_plz")
        val postalCode: String = "",
        @Json(name = "eak_ort")
        val location: String = "",
        @DoubleField
        @Json(name = "eak_lng")
        val longitude: Double = 0.0,
        @DoubleField
        @Json(name = "eak_lat")
        val latitude: Double = 0.0,
        @Json(name = "eak_tel")
        val telephone: String = "",
        @Json(name = "eak_mail")
        val email: String = "",
        @Json(name = "eak_homepage")
        val homepage: String = "",
        @IntegerField
        @Json(name = "eak_bayerische_kategorie")
        val bavarianCategory: Int? = null,
        @Json(name = "eak_rabatt")
        val discount: String = "",
        @Json(name = "eak_avatar")
        val avatar: String? = null,
        @BooleanField
        @Json(name = "eak_deleted")
        val deleted: Boolean? = null,
        @BooleanField
        @Json(name = "eak_public")
        val public: Boolean? = null,
        @IntegerField
        @Json(name = "eak_updated_test")
        val updatedTest: Int? = null
)
