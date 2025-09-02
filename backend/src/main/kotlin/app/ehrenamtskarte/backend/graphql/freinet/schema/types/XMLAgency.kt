package app.ehrenamtskarte.backend.graphql.freinet.schema.types

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlCData

data class XMLAgency(
    @JsonProperty("agenturid")
    @JacksonXmlCData
    val agencyId: String?,
    @JsonProperty("accessKey")
    @JacksonXmlCData
    val accessKey: String?,
    @JsonProperty("ars")
    @JacksonXmlCData
    val officialRegionalKeys: String?,
    @JsonProperty("agenturname")
    @JacksonXmlCData
    val agencyName: String?,
)
