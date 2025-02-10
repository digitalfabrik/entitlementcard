package app.ehrenamtskarte.backend.regions.webservice.schema.types

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement

@JacksonXmlRootElement(localName = "agencies")
data class XMLAgencies(
    @JsonProperty("mandant")
    @JacksonXmlElementWrapper(useWrapping = false)
    var agencies: ArrayList<XMLAgency> = ArrayList()
)
