package app.ehrenamtskarte.backend.graphql.application.utils

import app.ehrenamtskarte.backend.db.entities.ApplicationEntity
import app.ehrenamtskarte.backend.graphql.shared.exceptions.ApplicationDataIncompleteException
import app.ehrenamtskarte.backend.shared.utils.findValueByName
import app.ehrenamtskarte.backend.shared.utils.findValueByPath
import com.fasterxml.jackson.databind.JsonNode

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
