package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.database.ApplicationEntity
import app.ehrenamtskarte.backend.application.database.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.application.database.repos.ApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.create.Application
import app.ehrenamtskarte.backend.application.webservice.schema.create.PersonalData
import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.service.Authorizer.mayDeleteApplicationsInRegion
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidFileSizeException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidFileTypeException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.MailNotSentException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.mail.Mailer
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.execution.DataFetcherResult
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import org.simplejavamail.MailException
import org.slf4j.LoggerFactory
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

@Suppress("unused")
class EakApplicationMutationService {

    @GraphQLDescription("Stores a new application for an EAK")
    fun addEakApplication(
        regionId: Int,
        application: Application,
        project: String,
        dfe: DataFetchingEnvironment
    ): DataFetcherResult<Boolean> {
        val logger = LoggerFactory.getLogger(Mailer::class.java)
        val context = dfe.getContext<GraphQLContext>()
        val backendConfig = context.backendConfiguration
        val projectConfig = backendConfig.projects.first { it.id == project }

        transaction { RegionsRepository.findByIdInProject(project, regionId) } ?: throw RegionNotFoundException()
        // Validate that all files are png, jpeg or pdf files and at most 5MB.
        val allowedContentTypes = setOf("application/pdf", "image/png", "image/jpeg")
        val maxFileSizeBytes = 5 * 1000 * 1000
        if (!context.files.all { it.contentType in allowedContentTypes }) {
            throw InvalidFileTypeException()
        }
        if (!context.files.all { it.size <= maxFileSizeBytes }) {
            throw InvalidFileSizeException()
        }

        val (applicationEntity, verificationEntities) = transaction {
            ApplicationRepository.persistApplication(
                application.toJsonField(),
                application.extractApplicationVerifications(),
                regionId,
                context.applicationData,
                context.files
            )
        }

        try {
            Mailer.sendMail(
                backendConfig,
                projectConfig.smtp,
                projectConfig.administrationName,
                application.personalData.emailAddress.email,
                "Antrag erfolgreich eingereicht",
                generateApplicationApplicantMailMessage(projectConfig.administrationName, projectConfig.administrationBaseUrl, application.personalData, applicationEntity.accessKey)
            )
        } catch (exception: MailException) {
            logger.error(exception.message)
            throw MailNotSentException()
        }
        val dataFetcherResultBuilder = DataFetcherResult.newResult<Boolean>()
        for (applicationVerification in verificationEntities) {
            try {
                Mailer.sendMail(
                    backendConfig,
                    projectConfig.smtp,
                    projectConfig.administrationName,
                    applicationVerification.contactEmailAddress,
                    "Antrag Verifizieren",
                    generateApplicationVerificationMailMessage(projectConfig.administrationName, projectConfig.administrationBaseUrl, applicationVerification)
                )
            } catch (exception: MailException) {
                logger.error(exception.message)
                dataFetcherResultBuilder.error(MailNotSentException())
            }
        }
        return dataFetcherResultBuilder.data(true).build()
    }

    private fun generateApplicationVerificationMailMessage(
        administrationName: String,
        administrationBaseUrl: String,
        applicationVerification: ApplicationVerificationEntity
    ): String {
        return """
        Guten Tag ${applicationVerification.contactName},

        Sie wurden gebeten, die Angaben eines Antrags auf Ehrenamtskarte zu bestätigen. Die Antragsstellerin oder der
        Antragssteller hat Sie als Kontaktperson der Organisation ${applicationVerification.organizationName} angegeben. 
        Sie können den Antrag unter folgendem Link einsehen und die Angaben bestätigen oder ihnen widersprechen:
        $administrationBaseUrl/antrag-verifizieren/${URLEncoder.encode(applicationVerification.accessKey, StandardCharsets.UTF_8)}

        Dies ist eine automatisierte Nachricht. Antworten Sie nicht auf diese Email.

        - $administrationName
        """.trimIndent()
    }

    private fun generateApplicationApplicantMailMessage(
        administrationName: String,
        administrationBaseUrl: String,
        personalData: PersonalData,
        accessKey: String
    ): String {
        return """
        Guten Tag ${personalData.forenames.shortText} ${personalData.surname.shortText},

        Ihr Antrag zur Bayrischen Ehrenamtskarte wurde erfolgreich eingereicht. 
        
        Sie können den Status Ihres Antrags unter folgendem Link einsehen. Falls gewünscht, können Sie Ihren Antrag dort auch zurückziehen:
        $administrationBaseUrl/antrag-einsehen/${URLEncoder.encode(accessKey, StandardCharsets.UTF_8)}

        Dies ist eine automatisierte Nachricht. Antworten Sie nicht auf diese Email.

        - $administrationName
        """.trimIndent()
    }

    @GraphQLDescription("Deletes the application with specified id")
    fun deleteApplication(
        applicationId: Int,
        dfe: DataFetchingEnvironment
    ): Boolean {
        val context = dfe.getContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()

        return transaction {
            val application = ApplicationEntity.findById(applicationId) ?: throw UnauthorizedException()
            // We throw an UnauthorizedException here, as we do not know whether there was an application with id
            // `applicationId` and whether this application was contained in the user's project & region.

            val user = AdministratorEntity.findById(jwtPayload.adminId)
                ?: throw UnauthorizedException()

            if (!mayDeleteApplicationsInRegion(user, application.regionId.value)) {
                throw ForbiddenException()
            }

            ApplicationRepository.delete(applicationId, context)
        }
    }

    @GraphQLDescription("Withdraws the application")
    fun withdrawApplication(accessKey: String): Boolean {
        return transaction {
            ApplicationRepository.withdrawApplication(accessKey)
        }
    }

    @GraphQLDescription("Verifies or rejects an application verification")
    fun verifyOrRejectApplicationVerification(
        accessKey: String,
        verified: Boolean
    ): Boolean {
        return transaction {
            if (verified) {
                ApplicationRepository.verifyApplicationVerification(accessKey)
            } else {
                ApplicationRepository.rejectApplicationVerification(accessKey)
            }
        }
    }
}
