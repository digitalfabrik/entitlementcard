package app.ehrenamtskarte.backend.application.database.repos

import app.ehrenamtskarte.backend.application.database.ApplicationEntity
import app.ehrenamtskarte.backend.application.database.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.application.database.ApplicationVerificationExternalSource
import app.ehrenamtskarte.backend.application.database.ApplicationVerifications
import app.ehrenamtskarte.backend.application.database.Applications
import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.utils.ExtractedApplicationVerification
import app.ehrenamtskarte.backend.common.database.sortByKeys
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidLinkException
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.Regions
import com.fasterxml.jackson.databind.json.JsonMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import io.javalin.util.FileUtil
import jakarta.servlet.http.Part
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.SizedIterable
import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.File
import java.nio.file.Paths
import java.security.SecureRandom
import java.time.Instant
import java.util.Base64

object ApplicationRepository {
    fun persistApplication(
        applicationJson: JsonField,
        applicationVerifications: List<ExtractedApplicationVerification>,
        regionId: Int,
        applicationData: File,
        files: List<Part>,
    ): Pair<ApplicationEntity, List<ApplicationVerificationEntity>> =
        transaction {
            val random = SecureRandom.getInstanceStrong()
            val byteArray = ByteArray(64)
            random.nextBytes(byteArray)
            val applicationKey = Base64.getUrlEncoder().encodeToString(byteArray)
            val newApplication =
                ApplicationEntity.new {
                    this.regionId = EntityID(regionId, Regions)
                    this.jsonValue = toString(applicationJson)
                    this.accessKey = applicationKey
                }

            val verificationEntities = applicationVerifications.map {
                random.nextBytes(byteArray)
                val verificationKey = Base64.getUrlEncoder().encodeToString(byteArray)
                ApplicationVerificationEntity.new {
                    this.applicationId = newApplication.id
                    this.accessKey = verificationKey
                    this.contactName = it.contactName
                    this.organizationName = it.organizationName
                    this.contactEmailAddress = it.contactEmailAddress
                    this.automaticSource = ApplicationVerificationExternalSource.NONE
                }
            }

            val project = (Projects innerJoin Regions)
                .select(Projects.columns)
                .where { Regions.id eq regionId }
                .single()
                .let { ProjectEntity.wrapRow(it) }

            val projectDirectory = File(applicationData, project.project)
            val applicationDirectory = File(projectDirectory, newApplication.id.toString())

            try {
                files.forEachIndexed { index, part ->
                    FileUtil.streamToFile(
                        part.inputStream,
                        File(applicationDirectory, "$index").absolutePath,
                    )
                    File(applicationDirectory, "$index.contentType").writeText(part.contentType)
                }
                Pair(newApplication, verificationEntities)
            } catch (e: Exception) {
                applicationDirectory.deleteRecursively()
                throw e
            }
        }

    private fun toString(obj: JsonField): String {
        val mapper = JsonMapper()
        mapper.registerModule(KotlinModule.Builder().build())
        return mapper.writeValueAsString(obj)
    }

    fun getApplicationsByAdmin(regionId: Int): SizedIterable<ApplicationEntity> =
        transaction {
            ApplicationEntity.find { Applications.regionId eq regionId }
                .orderBy(Applications.createdDate to SortOrder.ASC)
        }

    fun getApplicationByApplicant(accessKey: String): ApplicationEntity? =
        transaction {
            ApplicationEntity
                .find { Applications.accessKey eq accessKey }
                .singleOrNull()
        }

    fun getApplicationByApplicationVerificationAccessKey(applicationVerificationAccessKey: String): ApplicationEntity? =
        transaction {
            (Applications innerJoin ApplicationVerifications)
                .select(Applications.columns)
                .where { ApplicationVerifications.accessKey eq applicationVerificationAccessKey }
                .singleOrNull()
                ?.let { ApplicationEntity.wrapRow(it) }
        }

    fun getApplicationVerification(applicationVerificationAccessKey: String): ApplicationVerificationEntity =
        transaction {
            ApplicationVerificationEntity
                .find { ApplicationVerifications.accessKey eq applicationVerificationAccessKey }
                .singleOrNull()
                ?: throw InvalidLinkException()
        }

    private fun isAlreadyVerified(applicationVerification: ApplicationVerificationEntity): Boolean =
        applicationVerification.verifiedDate != null || applicationVerification.rejectedDate != null

    fun verifyApplicationVerification(
        accessKey: String,
        automaticSource: ApplicationVerificationExternalSource = ApplicationVerificationExternalSource.NONE,
    ): Boolean =
        transaction {
            val applicationVerification = getApplicationVerification(accessKey)
            if (isAlreadyVerified(applicationVerification)) {
                false
            } else {
                applicationVerification.verifiedDate = Instant.now()
                applicationVerification.automaticSource = automaticSource
                true
            }
        }

    fun rejectApplicationVerification(accessKey: String): Boolean =
        transaction {
            val applicationVerification = getApplicationVerification(accessKey)
            if (isAlreadyVerified(applicationVerification)) {
                false
            } else {
                applicationVerification.rejectedDate = Instant.now()
                true
            }
        }

    fun delete(applicationId: Int, graphQLContext: GraphQLContext): Boolean =
        transaction {
            val application = ApplicationEntity.findById(applicationId)
            if (application != null) {
                val project = (Projects innerJoin Regions)
                    .select(Projects.columns)
                    .where { Regions.id eq application.regionId }
                    .single()
                    .let { ProjectEntity.wrapRow(it) }
                val applicationDirectory =
                    Paths.get(
                        graphQLContext.applicationData.absolutePath,
                        project.project,
                        application.id.toString(),
                    )
                ApplicationVerifications.deleteWhere { ApplicationVerifications.applicationId eq applicationId }
                application.delete()
                applicationDirectory.toFile().deleteRecursively()
            } else {
                false
            }
        }

    fun withdrawApplication(accessKey: String): Boolean =
        transaction {
            val application = ApplicationEntity.find { Applications.accessKey eq accessKey }.single()
            if (application.withdrawalDate == null) {
                application.withdrawalDate = Instant.now()
                true
            } else {
                false
            }
        }

    fun findByIds(ids: List<Int>): List<ApplicationEntity?> =
        transaction {
            ApplicationEntity
                .find { Applications.id inList ids }
                .sortByKeys({ it.id.value }, ids)
        }

    fun updateApplicationNote(applicationId: Int, note: String): Boolean =
        transaction {
            val application = ApplicationEntity.findById(applicationId)
            if (application != null) {
                application.note = note
                true
            } else {
                false
            }
        }

    fun updateCardCreated(applicationId: Int, cardCreated: Boolean): Boolean =
        transaction {
            val application = ApplicationEntity.findById(applicationId)
            if (application != null) {
                application.cardCreated = cardCreated
                true
            } else {
                false
            }
        }
}
