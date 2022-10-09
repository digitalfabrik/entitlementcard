package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable
import com.expediagroup.graphql.generator.annotations.GraphQLDescription

data class Organization(
    val name: String,
    val address: Address,
    @GraphQLDescription("Link zu Website oder Satzung")
    val website: String?,
    val contact: OrganizationContact,
    val category: String
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField {
        return JsonField(
            "organization", mapOf("de" to "Organisation/Verein"), Type.Array,
            listOfNotNull(
                JsonField("name", mapOf("de" to "Name"), Type.String, name),
                address.toJsonField(),
                if (website != null)
                    JsonField("website", mapOf("de" to "Link zu Website oder Satzung"), Type.String, website) else null,
                contact.toJsonField(),
                JsonField("category", mapOf("de" to "Kategorie"), Type.String, category)
            )
        )
    }
}
