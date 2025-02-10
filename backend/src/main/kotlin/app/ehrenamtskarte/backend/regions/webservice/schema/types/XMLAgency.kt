package app.ehrenamtskarte.backend.regions.webservice.schema.types

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlCData

data class XMLAgency(
    @JsonProperty("agenturid")
    @JacksonXmlCData
    var agencyId: String?,
    @JsonProperty("accessKey")
    @JacksonXmlCData
    var accessKey: String?,
    @JsonProperty("ars")
    @JacksonXmlCData
    var ars: String?
)
