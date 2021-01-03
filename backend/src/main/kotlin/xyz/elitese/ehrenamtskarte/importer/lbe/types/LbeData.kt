package xyz.elitese.ehrenamtskarte.importer.lbe.types

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonRootName
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlCData
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement

@JacksonXmlRootElement(localName = "akzeptanzpartner")
data class LbeData(
    @JsonProperty("anbieter")
    @JacksonXmlElementWrapper(useWrapping = false)
    var acceptingStores: ArrayList<LbeAcceptingStore> = ArrayList()
)
