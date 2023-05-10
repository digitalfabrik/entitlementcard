package app.ehrenamtskarte.backend.mail

import app.ehrenamtskarte.backend.application.database.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.application.webservice.schema.create.PersonalData
import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.config.ProjectConfig
import app.ehrenamtskarte.backend.config.SmtpConfig
import app.ehrenamtskarte.backend.exception.webservice.exceptions.MailNotSentException
import com.sanctionco.jmail.JMail
import org.simplejavamail.MailException
import org.simplejavamail.email.EmailBuilder
import org.simplejavamail.mailer.MailerBuilder
import org.slf4j.LoggerFactory
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

object Mailer {
    val DO_NOT_ANSWER_MESSAGE = "Dies ist eine automatisierte Nachricht. Bitte antworten Sie nicht auf diese Email."

    private fun sendMail(
        backendConfig: BackendConfiguration,
        smtpConfig: SmtpConfig,
        fromName: String,
        to: String,
        subject: String,
        message: String
    ) {
        val logger = LoggerFactory.getLogger(Mailer::class.java)

        if (!backendConfig.production) {
            logger.info(
                """
                Sending Email:
                FromName: $fromName
                To: $to
                Subject: $subject
                -----------------------
                
                """.trimIndent() + message
            )

            if (!JMail.isValid(smtpConfig.username)) {
                return
            }
        }
        try {
            MailerBuilder.withSMTPServer(smtpConfig.host, smtpConfig.port, smtpConfig.username, smtpConfig.password)
                .buildMailer()
                .sendMail(
                    EmailBuilder
                        .startingBlank()
                        .to(to)
                        .from(fromName, smtpConfig.username)
                        .withSubject(subject)
                        .withPlainText(message)
                        .withHeader("Content-Type", "text/plain; charset=utf8")
                        .buildEmail()
                ).join()
        } catch (exception: MailException) {
            logger.error(exception.message)
            throw MailNotSentException()
        }
    }

    fun sendNotificationForApplicationMails(
        project: String,
        backendConfig: BackendConfiguration,
        projectConfig: ProjectConfig
    ) {
        val recipients = AdministratorsRepository.getNotificationRecipientsForApplication(project)
        val message = """
        Guten Tag,

        ein neuer Antrag liegt in ${projectConfig.administrationName} vor.
        Sie können neue Anträge direkt unter ${projectConfig.administrationBaseUrl}/applications einsehen und bearbeiten.

        Falls Sie keine weiteren Benachrichtigungen zu neuen Anträgen erhalten möchten, können Sie dies unter ${projectConfig.administrationBaseUrl}/user-settings deaktivieren.

        $DO_NOT_ANSWER_MESSAGE

        - ${projectConfig.administrationName}
        """.trimIndent()
        for (recipient: AdministratorEntity in recipients) {
            try {
                sendMail(
                    backendConfig,
                    projectConfig.smtp,
                    projectConfig.administrationName,
                    recipient.email,
                    "Ein neuer Antrag ist eingegangen",
                    message
                )
            } catch (_: MailException) {}
        }
    }

    fun sendNotificationForVerificationMails(
        project: String,
        backendConfig: BackendConfiguration,
        projectConfig: ProjectConfig
    ) {
        val recipients = AdministratorsRepository.getNotificationRecipientsForVerification(project)
        val message = """
        Guten Tag,

        ein Antrag ist verifiziert worden. 
        Sie können Anträge direkt unter ${projectConfig.administrationBaseUrl}/applications einsehen und bearbeiten.

        Falls Sie keine weiteren Benachrichtigungen zu neuen Anträgen erhalten möchten können Sie dies unter ${projectConfig.administrationBaseUrl}/user-settings deaktivieren.

        $DO_NOT_ANSWER_MESSAGE
        
        - ${projectConfig.administrationName}
        """.trimIndent()
        for (recipient: AdministratorEntity in recipients) {
            try {
                sendMail(
                    backendConfig,
                    projectConfig.smtp,
                    projectConfig.administrationName,
                    recipient.email,
                    "Ein Antrag ist verifiziert worden",
                    message
                )
            } catch (_: MailException) {}
        }
    }

    fun sendApplicationVerificationMail(backendConfig: BackendConfiguration, projectConfig: ProjectConfig, applicationVerification: ApplicationVerificationEntity) {
        val message = """
        Guten Tag ${applicationVerification.contactName},

        Sie wurden gebeten, die Angaben eines Antrags auf eine Ehrenamtskarte zu bestätigen. Die Antragsstellerin oder der
        Antragssteller hat Sie als Kontaktperson der Organisation ${applicationVerification.organizationName} angegeben. 
        Sie können den Antrag unter folgendem Link einsehen und die Angaben bestätigen oder ihnen widersprechen:
        ${projectConfig.administrationBaseUrl}/antrag-verifizieren/${URLEncoder.encode(applicationVerification.accessKey, StandardCharsets.UTF_8)}

        $DO_NOT_ANSWER_MESSAGE

        - ${projectConfig.administrationName}
        """.trimIndent()
        sendMail(
            backendConfig,
            projectConfig.smtp,
            projectConfig.administrationName,
            applicationVerification.contactEmailAddress,
            "Bestätigung notwendig: Antrag auf Bayerische Ehrenamtskarte",
            message
        )
    }

    fun sendApplicationApplicantMail(
        backendConfig: BackendConfiguration,
        projectConfig: ProjectConfig,
        personalData: PersonalData,
        accessKey: String
    ) {
        val message = """
        Guten Tag ${personalData.forenames.shortText} ${personalData.surname.shortText},

        Ihr Antrag zur Bayrischen Ehrenamtskarte wurde erfolgreich eingereicht. 
        
        Sie können den Status Ihres Antrags unter folgendem Link einsehen. Falls gewünscht, können Sie Ihren Antrag dort auch zurückziehen:
        ${projectConfig.administrationBaseUrl}/antrag-einsehen/${URLEncoder.encode(accessKey, StandardCharsets.UTF_8)}

        $DO_NOT_ANSWER_MESSAGE

        - ${projectConfig.administrationName}
        """.trimIndent()
        sendMail(
            backendConfig,
            projectConfig.smtp,
            projectConfig.administrationName,
            personalData.emailAddress.email,
            "Antrag erfolgreich eingereicht",
            message
        )
    }

    fun sendResetPasswodMail(
        backendConfig: BackendConfiguration,
        projectConfig: ProjectConfig,
        passwortResetKey: String,
        recipient: String
    ) {
        val message = """
        Guten Tag,
        
        Sie haben angefragt, Ihr Passwort für ${projectConfig.administrationName} zurückzusetzen.
        Sie können Ihr Passwort unter dem folgenden Link zurücksetzen:
        ${projectConfig.administrationBaseUrl}/reset-password?email=${URLEncoder.encode(recipient, StandardCharsets.UTF_8)}&token=${URLEncoder.encode(passwortResetKey, StandardCharsets.UTF_8)}
        
        Dieser Link ist 24 Stunden gültig.
        
        $DO_NOT_ANSWER_MESSAGE
        
        - ${projectConfig.administrationName}
        """.trimIndent()
        sendMail(
            backendConfig,
            projectConfig.smtp,
            projectConfig.administrationName,
            recipient,
            "Passwort Zurücksetzen",
            message
        )
    }

    fun sendWelcomeMail(
        backendConfig: BackendConfiguration,
        projectConfig: ProjectConfig,
        passwordResetKey: String,
        recipient: String
    ) {
        val message = """
        Guten Tag,
        
        für Sie wurde ein Account für ${projectConfig.administrationName} erstellt.
        Sie können Ihr Passwort unter dem folgenden Link setzen:
        ${projectConfig.administrationBaseUrl}/reset-password?email=${URLEncoder.encode(recipient, StandardCharsets.UTF_8)}&token=${URLEncoder.encode(passwordResetKey, StandardCharsets.UTF_8)}
        
        Dieser Link ist 24 Stunden gültig.
        
        $DO_NOT_ANSWER_MESSAGE
        
        - ${projectConfig.administrationName}
        """.trimIndent()
        sendMail(backendConfig, projectConfig.smtp, projectConfig.administrationName, recipient, "Kontoerstellung", message)
    }
}
