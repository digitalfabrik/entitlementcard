package app.ehrenamtskarte.backend.import.stores.bayern.types

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonRootName
import tools.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper

@JsonRootName("akzeptanzpartner")
data class LbeData(
    @JsonProperty("anbieter")
    @JacksonXmlElementWrapper(useWrapping = false)
    var acceptingStores: ArrayList<LbeAcceptingStore> = ArrayList(),
)
