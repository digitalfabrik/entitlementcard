package app.ehrenamtskarte.backend.stores.importer.bayern.types

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlCData

data class LbeAcceptingStore(
    @JsonProperty("name")
    @JacksonXmlCData
    var name: String?,
    @JsonProperty("strasse")
    @JacksonXmlCData
    var street: String?,
    @JsonProperty("hausnummer")
    @JacksonXmlCData
    var houseNumber: String?,
    @JsonProperty("plz")
    @JacksonXmlCData
    var postalCode: String?,
    @JsonProperty("ort")
    @JacksonXmlCData
    var location: String?,
    @JsonProperty("breitengrad")
    @JacksonXmlCData
    var latitude: String?,
    @JsonProperty("laengengrad")
    @JacksonXmlCData
    var longitude: String?,
    @JsonProperty("telefon")
    @JacksonXmlCData
    var telephone: String?,
    @JsonProperty("email")
    @JacksonXmlCData
    var email: String?,
    @JsonProperty("homepage_url")
    @JacksonXmlCData
    var homepage: String?,
    @JsonProperty("rabatt")
    @JacksonXmlCData
    var discount: String?,
    @JsonProperty("kategorie")
    @JacksonXmlCData
    var category: String?,
    @JsonProperty("p_eak_agentur_id")
    @JacksonXmlCData
    var freinetId: String?,
    @JsonProperty("anbieter_name")
    @JacksonXmlCData
    var districtName: String?,
    @JsonProperty("p_eak_datensatz_id")
    @JacksonXmlCData
    var freinetDataId: String?,
)
