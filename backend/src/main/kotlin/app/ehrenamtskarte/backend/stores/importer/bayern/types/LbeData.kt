package app.ehrenamtskarte.backend.stores.importer.bayern.types

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement

@JacksonXmlRootElement(localName = "akzeptanzpartner")
data class LbeData(
    @JsonProperty("anbieter")
    @JacksonXmlElementWrapper(useWrapping = false)
    var acceptingStores: ArrayList<LbeAcceptingStore> = ArrayList(),
)
