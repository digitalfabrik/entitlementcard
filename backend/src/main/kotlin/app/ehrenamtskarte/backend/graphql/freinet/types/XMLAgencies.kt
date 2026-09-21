package app.ehrenamtskarte.backend.graphql.freinet.types

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonRootName
import tools.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper

@JsonRootName("agencies")
data class XMLAgencies(
    @JsonProperty("mandant")
    @JacksonXmlElementWrapper(useWrapping = false)
    val agencies: ArrayList<XMLAgency> = ArrayList(),
)
