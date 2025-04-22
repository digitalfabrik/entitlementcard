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
import java.net.URL
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

object Mailer {
    private fun EmailBody.finalInformationParagraph(projectConfig: ProjectConfig) {
        p {
            +"Bitte beachten Sie, dass dies eine automatisierte Nachricht ist. "
            +"Antworten auf diese E-Mail werden nicht gelesen."
            br()
            br()
            +"Mit freundlichen Grüßen"
            br()
            +"- ${projectConfig.administrationName}"
        }
    }

    private fun EmailBody.adjustNotificationsParagraph(projectConfig: ProjectConfig) {
        p {
            +"Email-Benachrichtigungen zu Anträgen können Sie hier konfigurieren:"
            br()
            link(URL("${projectConfig.administrationBaseUrl}/user-settings"))
        }
    }

    private fun EmailBody.viewApplicationsParagraph(projectConfig: ProjectConfig) {
        p {
            +"Unter folgendem Link können Sie Anträge einsehen und bearbeiten:"
            br()
            link(URL("${projectConfig.administrationBaseUrl}/applications"))
        }
    }

    private fun urlEncode(str: String) = URLEncoder.encode(str, StandardCharsets.UTF_8)

    private fun sendMail(
        backendConfig: BackendConfiguration,
        smtpConfig: SmtpConfig,
        fromName: String,
        to: String,
        subject: String,
        message: EmailBody,
    ) {
        val logger = LoggerFactory.getLogger(Mailer::class.java)

        if (backendConfig.isDevelopment()) {
            logger.info(
                """
                Sending Email:
                FromName: $fromName
                To: $to
                Subject: $subject
                -----------------------
                
                """.trimIndent() + message.renderPlain(),
            )

            if (!JMail.isValid(smtpConfig.username)) {
                logger.info("SMTP config invalid; did not try to send email.")
                return
            }
        }
        try {
            MailerBuilder.withSMTPServer(
                smtpConfig.host,
                smtpConfig.port,
                smtpConfig.username,
                smtpConfig.password,
            )
                .buildMailer()
                .sendMail(
                    EmailBuilder
                        .startingBlank()
                        .to(to)
                        .from(fromName, smtpConfig.username)
                        .withSubject(subject)
                        .withPlainText(message.renderPlain())
                        .withHTMLText(message.renderHtml())
                        .buildEmail(),
                ).join()
        } catch (exception: MailException) {
            logger.error(exception.message)
            throw MailNotSentException(to)
        }
    }

    fun sendNotificationForApplicationMails(
        project: String,
        backendConfig: BackendConfiguration,
        projectConfig: ProjectConfig,
        regionId: Int,
    ) {
        val recipients = AdministratorsRepository.getNotificationRecipientsForApplication(
            project,
            regionId,
        )
        val subject = "Ein neuer Antrag ist eingegangen"
        val message = emailBody {
            p { +"Guten Tag," }
            p { +"ein neuer Antrag liegt in ${projectConfig.administrationName} vor." }
            viewApplicationsParagraph(projectConfig)
            adjustNotificationsParagraph(projectConfig)
            finalInformationParagraph(projectConfig)
        }

        for (recipient: AdministratorEntity in recipients) {
            try {
                sendMail(
                    backendConfig,
                    projectConfig.smtp,
                    projectConfig.administrationName,
                    recipient.email,
                    subject,
                    message,
                )
            } catch (_: MailNotSentException) {
            }
        }
    }

    fun sendNotificationForVerificationMails(
        project: String,
        backendConfig: BackendConfiguration,
        projectConfig: ProjectConfig,
        regionId: Int,
    ) {
        val recipients = AdministratorsRepository.getNotificationRecipientsForVerification(
            project,
            regionId,
        )
        val subject = "Ein Antrag wurde verifiziert"
        val message = emailBody {
            p { +"Guten Tag," }
            p { +"ein Antrag wurde verifiziert." }
            viewApplicationsParagraph(projectConfig)
            adjustNotificationsParagraph(projectConfig)
            finalInformationParagraph(projectConfig)
        }

        for (recipient: AdministratorEntity in recipients) {
            try {
                sendMail(
                    backendConfig,
                    projectConfig.smtp,
                    projectConfig.administrationName,
                    recipient.email,
                    subject,
                    message,
                )
            } catch (_: MailNotSentException) {
            }
        }
    }

    fun sendApplicationVerificationMail(
        backendConfig: BackendConfiguration,
        applicantName: String,
        projectConfig: ProjectConfig,
        applicationVerification: ApplicationVerificationEntity,
    ) {
        val subject = "Bestätigung notwendig: Antrag auf Bayerische Ehrenamtskarte [$applicantName]"
        val verificationLink =
            URL(
                "${projectConfig.administrationBaseUrl}/antrag-verifizieren/${urlEncode(
                    applicationVerification.accessKey,
                )}",
            )

        val message = emailBody {
            p { +"Guten Tag ${applicationVerification.contactName}" }
            p {
                +"Sie wurden gebeten, die Angaben eines Antrags auf eine Ehrenamtskarte zu bestätigen. "
                +"Die Antragstellerin oder der Antragsteller hat Sie als Kontaktperson der Organisation "
                +"${applicationVerification.organizationName} angegeben."
            }
            p {
                +"Sie können den Antrag unter folgendem Link einsehen und die Angaben bestätigen oder "
                +"ihnen widersprechen:"
                br()
                link(verificationLink)
            }
            finalInformationParagraph(projectConfig)
        }

        sendMail(
            backendConfig,
            projectConfig.smtp,
            projectConfig.administrationName,
            applicationVerification.contactEmailAddress,
            subject,
            message,
        )
    }

    fun sendApplicationApplicantMail(
        backendConfig: BackendConfiguration,
        projectConfig: ProjectConfig,
        personalData: PersonalData,
        accessKey: String,
    ) {
        val subject = "Antrag erfolgreich eingereicht"
        val message = emailBody {
            p { +"Guten Tag ${personalData.forenames.shortText} ${personalData.surname.shortText}," }
            p { +"Ihr Antrag zur Bayerischen Ehrenamtskarte wurde erfolgreich eingereicht." }
            p {
                +"Sie können den Status Ihres Antrags unter folgendem Link einsehen. "
                +"Falls gewünscht, können Sie Ihren Antrag dort auch zurückziehen:"
                br()
                link(URL("${projectConfig.administrationBaseUrl}/antrag-einsehen/${urlEncode(accessKey)}"))
            }
            p {
                +"Bei Rückfragen zum Bearbeitungsstand wenden Sie sich bitte an Ihr örtliches "
                +"Landratsamt bzw. die Verwaltung Ihrer kreisfreien Stadt."
            }
            finalInformationParagraph(projectConfig)
        }
        sendMail(
            backendConfig,
            projectConfig.smtp,
            projectConfig.administrationName,
            personalData.emailAddress.email,
            subject,
            message,
        )
    }

    fun sendApplicationMailToContactPerson(
        backendConfig: BackendConfiguration,
        projectConfig: ProjectConfig,
        contactPerson: String,
        personalData: PersonalData,
        accessKey: String,
    ) {
        val subject = "Antrag erfolgreich eingereicht"
        val message = emailBody {
            p { +"Sehr geehrte/r $contactPerson," }
            p {
                +"Ihr Antrag auf die Bayerische Ehrenamtskarte für ${personalData.forenames.shortText} "
                +"${personalData.surname.shortText} wurde erfolgreich eingereicht."
            }
            p {
                +"Den aktuellen Status Ihres Antrags können sie jederzeit unter folgendem Link einsehen. "
                +"Dort haben Sie auch die Möglichkeit, Ihren Antrag bei Bedarf zurückzuziehen:"
                br()
                link(URL("${projectConfig.administrationBaseUrl}/antrag-einsehen/${urlEncode(accessKey)}"))
            }
            p {
                +"Bei Rückfragen wenden Sie sich bitte direkt an Ihr zuständiges Landratsamt oder die "
                +"Verwaltung Ihrer kreisfreien Stadt."
            }
            finalInformationParagraph(projectConfig)
        }
        sendMail(
            backendConfig,
            projectConfig.smtp,
            projectConfig.administrationName,
            personalData.emailAddress.email,
            subject,
            message,
        )
    }

    fun sendResetPasswordMail(
        backendConfig: BackendConfiguration,
        projectConfig: ProjectConfig,
        passwortResetKey: String,
        recipient: String,
    ) {
        val subject = "Passwort Zurücksetzen"
        val encodedRecipient = urlEncode(recipient)
        val encodedResetKey = urlEncode(passwortResetKey)
        val message = emailBody {
            p { +"Guten Tag," }
            p { +"Sie haben angefragt, Ihr Passwort für ${projectConfig.administrationName} zurückzusetzen." }
            p {
                +"Sie können Ihr Passwort unter dem folgenden Link zurücksetzen:"
                br()
                link(
                    URL(
                        "${projectConfig.administrationBaseUrl}/reset-password?" +
                            "email=$encodedRecipient&token=$encodedResetKey",
                    ),
                )
            }
            p { +"Dieser Link ist 24 Stunden gültig." }
            finalInformationParagraph(projectConfig)
        }

        sendMail(
            backendConfig,
            projectConfig.smtp,
            projectConfig.administrationName,
            recipient,
            subject,
            message,
        )
    }

    fun sendWelcomeMail(
        backendConfig: BackendConfiguration,
        projectConfig: ProjectConfig,
        passwordResetKey: String,
        recipient: String,
    ) {
        val passwordResetLink =
            "${projectConfig.administrationBaseUrl}/reset-password?" +
                "email=${urlEncode(recipient)}&token=${urlEncode(passwordResetKey)}"
        val subject = "Kontoerstellung"
        val message = emailBody {
            p { +"Guten Tag," }
            p { +"für Sie wurde ein Account für ${projectConfig.administrationName} erstellt." }
            p {
                +"Sie können Ihr Passwort unter dem folgenden Link setzen:"
                br()
                link(URL(passwordResetLink))
            }
            p { +"Dieser Link ist 24 Stunden gültig." }
            finalInformationParagraph(projectConfig)
        }

        sendMail(
            backendConfig,
            projectConfig.smtp,
            projectConfig.administrationName,
            recipient,
            subject,
            message,
        )
    }

    fun sendCardCreationConfirmationMail(
        backendConfig: BackendConfiguration,
        projectConfig: ProjectConfig,
        deepLink: String,
        recipientAddress: String,
        recipientName: String,
    ) {
        val subject = "Kartenerstellung erfolgreich"
        val message = emailBody {
            p { +"Guten Tag $recipientName," }
            p {
                +"Ihr Antrag zur Bayerischen Ehrenamtskarte wurde bewilligt. "
                +"Die Bayerische Ehrenamtskarte wird Ihnen in den nächsten Tagen "
                +"zusammen mit einer Anleitung zur Einrichtung der digitalen Karte zugestellt."
            }
            p {
                +"Falls Sie die App „Ehrenamtskarte Bayern“ auf Ihrem Smartphone bereits "
                +"installiert haben, können Sie in vielen Fällen die digitale Karte auch vorab aktivieren. "
                +"Klicken Sie dazu von Ihrem Smartphone, auf dem die App installiert ist, auf den folgenden Link:"
                br()
                link(URL(deepLink))
            }
            p {
                +"Hinweis: Die Vorab-Aktivierung wird nicht von allen Endgeräten unterstützt. "
                +"Falls der Vorgang fehlschlägt, warten Sie bitte auf das offizielle Schreiben."
            }
            finalInformationParagraph(projectConfig)
        }

        sendMail(
            backendConfig,
            projectConfig.smtp,
            projectConfig.administrationName,
            recipientAddress,
            subject,
            message,
        )
    }
}
