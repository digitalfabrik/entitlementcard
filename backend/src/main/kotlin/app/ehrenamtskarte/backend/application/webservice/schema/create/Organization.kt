package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable
import com.expediagroup.graphql.annotations.GraphQLDescription

data class Organization(
    val name: String,
    val address: String,
    @GraphQLDescription("Link zu Website oder Satzung")
    val website: String?,
    val contact: OrganizationContact
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField {
        return JsonField(
            "organization", mapOf("de" to "Organisation/Verein"), Type.Array, listOfNotNull(
                JsonField("name", mapOf("de" to "Name"), Type.String, name),
                JsonField("address", mapOf("de" to "Adresse"), Type.String, address),
                if (website != null)
                    JsonField("website", mapOf("de" to "Link zu Website oder Satzung"), Type.String, website) else null,
                contact.toJsonField()
            )
        )
    }

}
