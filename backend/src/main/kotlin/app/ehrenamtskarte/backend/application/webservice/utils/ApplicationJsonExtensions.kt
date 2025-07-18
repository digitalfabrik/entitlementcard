package app.ehrenamtskarte.backend.application.webservice.utils

import app.ehrenamtskarte.backend.application.database.ApplicationEntity
import app.ehrenamtskarte.backend.common.utils.findValueByName
import app.ehrenamtskarte.backend.common.utils.findValueByPath
import app.ehrenamtskarte.backend.exception.webservice.exceptions.ApplicationDataIncompleteException
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
