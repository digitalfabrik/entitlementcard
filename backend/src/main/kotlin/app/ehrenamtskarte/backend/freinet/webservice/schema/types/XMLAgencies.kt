package app.ehrenamtskarte.backend.freinet.webservice.schema.types

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement

@JacksonXmlRootElement(localName = "agencies")
data class XMLAgencies(
    @JsonProperty("mandant")
    @JacksonXmlElementWrapper(useWrapping = false)
    val agencies: ArrayList<XMLAgency> = ArrayList()
)
