package app.ehrenamtskarte.backend.graphql.application.types

import app.ehrenamtskarte.backend.db.entities.ApplicationVerificationEntity

data class ApplicationVerificationView(
    val verificationId: Int,
    val contactName: String,
    val contactEmailAddress: String,
    val organizationName: String,
    val verifiedDate: String?,
    val rejectedDate: String?,
) {
    companion object {
        fun fromDbEntity(entity: ApplicationVerificationEntity): ApplicationVerificationView =
            ApplicationVerificationView(
                entity.id.value,
                entity.contactName,
                entity.contactEmailAddress,
                entity.organizationName,
                entity.verifiedDate?.toString(),
                entity.rejectedDate?.toString(),
            )
    }
}
