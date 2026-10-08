package app.ehrenamtskarte.backend.graphql.application.utils

import app.ehrenamtskarte.backend.db.entities.ApplicationEntity
import app.ehrenamtskarte.backend.graphql.exceptions.ApplicationDataIncompleteException
import app.ehrenamtskarte.backend.shared.utils.findValueByName
import app.ehrenamtskarte.backend.shared.utils.findValueByPath
import tools.jackson.databind.JsonNode
import tools.jackson.databind.node.ArrayNode

fun ApplicationEntity.getApplicantFirstName(): String =
    this.getPersonalDataNode().findValueByName("forenames")
        ?: throw ApplicationDataIncompleteException()

fun ApplicationEntity.getApplicantLastName(): String =
    this.getPersonalDataNode().findValueByName("surname")
        ?: throw ApplicationDataIncompleteException()

fun ApplicationEntity.getApplicantDateOfBirth(): String =
    this.getPersonalDataNode().findValueByName("dateOfBirth")
        ?: throw ApplicationDataIncompleteException()

fun ApplicationEntity.getApplicantName(): String {
    val forenames = this.getApplicantFirstName()
    val surname = this.getApplicantLastName()

    return listOfNotNull(forenames, surname).filter { it.isNotBlank() }.joinToString(" ")
}

fun ApplicationEntity.getApplicantEmail(): String =
    this.getPersonalDataNode().findValueByName("emailAddress")
        ?: throw ApplicationDataIncompleteException()

fun ApplicationEntity.getPersonalDataNode(): JsonNode =
    this.parseJsonValue().findValueByPath("application", "personalData")
        ?: throw ApplicationDataIncompleteException()

/**
 * Returns the json value of the application, keeping only the organizations whose contact email matches
 * [contactEmailAddress], so that a verifying organization does not see data entered for other organizations.
 */
fun ApplicationEntity.getJsonValueForOrganization(contactEmailAddress: String): String {
    val root = this.parseJsonValue()
    root.removeWorkAtOrganizationsExcept(contactEmailAddress)
    return root.toString()
}

private fun JsonNode.removeWorkAtOrganizationsExcept(contactEmailAddress: String) {
    val children = this["value"] as? ArrayNode ?: return
    children.removeIf { child ->
        child["name"]?.asString() == "workAtOrganization" &&
            child.findValueByPath("workAtOrganization", "organization", "organizationContact", "email")
                ?.asString() != contactEmailAddress
    }
    children.forEach { it.removeWorkAtOrganizationsExcept(contactEmailAddress) }
}
