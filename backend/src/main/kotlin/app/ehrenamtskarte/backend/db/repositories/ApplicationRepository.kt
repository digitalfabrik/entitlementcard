package app.ehrenamtskarte.backend.db.repositories

import app.ehrenamtskarte.backend.db.entities.ApplicationEntity
import app.ehrenamtskarte.backend.db.entities.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.db.entities.ApplicationVerificationExternalSource
import app.ehrenamtskarte.backend.db.entities.ApplicationVerifications
import app.ehrenamtskarte.backend.db.entities.Applications
import app.ehrenamtskarte.backend.db.entities.ProjectEntity
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.db.entities.Regions
import app.ehrenamtskarte.backend.graphql.application.types.ExtractedApplicationVerification
import app.ehrenamtskarte.backend.graphql.application.types.JsonField
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidLinkException
import app.ehrenamtskarte.backend.shared.database.sortByKeys
import com.fasterxml.jackson.databind.json.JsonMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import kotlinx.coroutines.reactive.collect
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.SizedIterable
import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere
import org.springframework.http.codec.multipart.Part
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
    ): Pair<ApplicationEntity, List<ApplicationVerificationEntity>> {
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

        return try {
            applicationDirectory.mkdirs()
            files.forEachIndexed { index, part ->
                File(applicationDirectory, "$index").outputStream().buffered().use { outputStream ->
                    part.content().subscribe { it.asInputStream().copyTo(outputStream) }
                }

                File(applicationDirectory, "$index.contentType").writeText(part.headers().contentType.toString())
            }
            Pair(newApplication, verificationEntities)
        } catch (e: Exception) {
            applicationDirectory.deleteRecursively()
            throw e
        }
    }

    // TODO Express this as a method of JsonField (and reuse mapper)
    private fun toString(obj: JsonField): String {
        val mapper = JsonMapper()
        mapper.registerModule(KotlinModule.Builder().build())
        return mapper.writeValueAsString(obj)
    }

    fun getApplicationsByAdmin(regionId: Int): SizedIterable<ApplicationEntity> =
        ApplicationEntity.find { Applications.regionId eq regionId }
            .orderBy(Applications.createdDate to SortOrder.ASC)

    fun getApplicationByApplicant(accessKey: String): ApplicationEntity? =
        ApplicationEntity
            .find { Applications.accessKey eq accessKey }
            .singleOrNull()

    fun getApplicationByApplicationVerificationAccessKey(applicationVerificationAccessKey: String): ApplicationEntity? =
        (Applications innerJoin ApplicationVerifications)
            .select(Applications.columns)
            .where { ApplicationVerifications.accessKey eq applicationVerificationAccessKey }
            .singleOrNull()
            ?.let { ApplicationEntity.wrapRow(it) }

    fun getApplicationVerification(applicationVerificationAccessKey: String): ApplicationVerificationEntity =
        ApplicationVerificationEntity
            .find { ApplicationVerifications.accessKey eq applicationVerificationAccessKey }
            .singleOrNull()
            ?: throw InvalidLinkException()

    fun verifyApplicationVerification(
        accessKey: String,
        automaticSource: ApplicationVerificationExternalSource = ApplicationVerificationExternalSource.NONE,
    ): Boolean {
        val applicationVerification = getApplicationVerification(accessKey)

        return if (!applicationVerification.isVerified) {
            applicationVerification.verifiedDate = Instant.now()
            applicationVerification.automaticSource = automaticSource
            true
        } else {
            false
        }
    }

    fun rejectApplicationVerification(accessKey: String): Boolean =
        getApplicationVerification(accessKey).let {
            if (!it.isVerified) {
                it.rejectedDate = Instant.now()
                true
            } else {
                false
            }
        }

    fun delete(project: String, application: ApplicationEntity, applicationData: File) {
        ApplicationVerifications.deleteWhere { ApplicationVerifications.applicationId eq application.id }
        application.delete()

        val applicationDirectory = Paths.get(
            applicationData.absolutePath,
            project,
            application.id.toString(),
        ).toFile()

        if (applicationDirectory.exists()) {
            applicationDirectory.deleteRecursively()
        }
    }

    fun findByIds(ids: List<Int>): List<ApplicationEntity?> =
        ApplicationEntity
            .find { Applications.id inList ids }
            .sortByKeys({ it.id.value }, ids)

    fun updateApplicationNote(applicationId: Int, note: String): Boolean {
        val application = ApplicationEntity.findById(applicationId)

        return if (application != null) {
            application.note = note
            true
        } else {
            false
        }
    }
}
