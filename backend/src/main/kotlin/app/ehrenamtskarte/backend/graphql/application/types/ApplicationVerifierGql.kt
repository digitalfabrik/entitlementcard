package app.ehrenamtskarte.backend.graphql.application.types

import app.ehrenamtskarte.backend.db.entities.ApplicationEntity
import app.ehrenamtskarte.backend.db.entities.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.graphql.application.utils.getJsonValueForOrganization
import com.expediagroup.graphql.generator.annotations.GraphQLName

/**
 * Application as seen by a verifying organization. The jsonValue only contains the data of the verifying organization.
 */
@GraphQLName("ApplicationVerifier")
data class ApplicationVerifierGql(
    val id: Int,
    val regionId: Int,
    val createdDate: String,
    val jsonValue: String,
    val status: ApplicationStatus,
    val statusResolvedDate: String?,
) {
    companion object {
        fun fromDbEntity(
            entity: ApplicationEntity,
            verification: ApplicationVerificationEntity,
        ): ApplicationVerifierGql =
            ApplicationVerifierGql(
                id = entity.id.value,
                regionId = entity.regionId.value,
                createdDate = entity.createdDate.toString(),
                jsonValue = entity.getJsonValueForOrganization(verification.contactEmailAddress),
                status = entity.status.toGraphQlType(),
                statusResolvedDate = entity.statusResolvedDate?.toString(),
            )
    }
}
