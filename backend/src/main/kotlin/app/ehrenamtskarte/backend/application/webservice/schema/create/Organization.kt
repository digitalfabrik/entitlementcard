package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.ShortTextInput
import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable
import com.expediagroup.graphql.generator.annotations.GraphQLDescription

data class Organization(
    val name: ShortTextInput,
    val address: Address,
    @GraphQLDescription("Link zu Website oder Satzung")
    val website: ShortTextInput?,
    val contact: OrganizationContact,
    val category: ShortTextInput
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField {
        return JsonField(
            "organization",
            mapOf("de" to "Organisation/Verein"),
            Type.Array,
            listOfNotNull(
                name.toJsonField("name", mapOf("de" to "Name")),
                address.toJsonField(),
                website?.toJsonField("website", mapOf("de" to "Link zu Website oder Satzung")),
                contact.toJsonField(),
                category.toJsonField("category", mapOf("de" to "Kategorie"))
            )
        )
    }
}
