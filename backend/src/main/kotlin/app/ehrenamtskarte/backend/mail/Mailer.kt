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
            +projectConfig.emailSignature
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

    private fun EmailBody.applicationConfirmationNoteParagraph(note: String?) {
        if (!note.isNullOrBlank()) {
            p {
                plain(note)
            }
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
        val subject = "Bestätigung der Angaben für den Antrag auf eine Ehrenamtskarte von $applicantName"
        val verificationLink =
            URL(
                "${projectConfig.administrationBaseUrl}/antrag-verifizieren/${urlEncode(
                    applicationVerification.accessKey,
                )}",
            )

        val message = emailBody {
            p { +"Sehr geehrte/r ${applicationVerification.contactName}," }
            p {
                +"im Rahmen des Antrags auf eine Ehrenamtskarte wurden Sie als Kontaktperson der Organisation "
                +"${applicationVerification.organizationName} angegeben. "
                +"Wir möchten Sie daher bitten, die im Antrag gemachten Angaben zu überprüfen und zu bestätigen."
            }
            p {
                +"Unter dem folgenden Link können Sie den Antrag einsehen und die Angaben entweder bestätigen "
                +"oder ihnen widersprechen:"
                br()
                link(verificationLink)
            }
            p {
                +"Hinweis: Die Website ist durch eine sichere Verbindung geschützt. "
                +"Sie müssen keine persönlichen Daten eingeben."
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
        applicationConfirmationNote: String?,
    ) {
        val subject = "Ihr Antrag für die Ehrenamtskarte Bayern ist eingegangen"
        val message = emailBody {
            p { +"Sehr geehrte/r ${personalData.forenames.shortText} ${personalData.surname.shortText}," }
            p {
                +"vielen Dank für Ihren Antrag und Ihr Interesse an der Bayerischen Ehrenamtskarte. "
                +"Wir danken Ihnen für das Engagement und die Zeit, die Sie zum Wohle der Gemeinschaft einbringen."
            }
            p {
                +"Wir möchten Sie darüber informieren, dass Ihr Antrag derzeit bearbeitet wird. "
                +"Unter folgendem Link können Sie den aktuellen Status Ihres Antrags einsehen oder den Antrag "
                +"bei Bedarf zurückziehen:"
                br()
                link(URL("${projectConfig.administrationBaseUrl}/antrag-einsehen/${urlEncode(accessKey)}"))
            }
            applicationConfirmationNoteParagraph(applicationConfirmationNote)
            p {
                +"Falls Sie Fragen zu Ihrem Antrag haben oder Unterstützung benötigen, "
                +"wenden Sie sich bitte direkt an das örtliche Landratsamt bzw. die Verwaltung Ihrer kreisfreien Stadt."
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
        applicationConfirmationNote: String?,
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
            applicationConfirmationNoteParagraph(applicationConfirmationNote)
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
        val subject = "Ihr Antrag für die Ehrenamtskarte Bayern wurde bewilligt"
        val message = emailBody {
            p { +"Sehr geehrte/r $recipientName," }
            p {
                +"wir freuen uns, Ihnen mitteilen zu können, "
                +"dass Ihr Antrag auf die Bayerische Ehrenamtskarte bewilligt wurde!"
            }
            p {
                +"In den kommenden Tagen erhalten Sie Ihre persönliche Ehrenamtskarte "
                +"zusammen mit einer Anleitung, wie Sie die digitale Version einrichten können."
            }
            p {
                +"Falls Sie bereits die App „Ehrenamtskarte Bayern“ auf Ihrem Smartphone installiert haben, "
                +"können Sie in vielen Fällen die digitale Karte schon jetzt aktivieren. "
                +"Klicken Sie dazu einfach auf den folgenden Link von Ihrem Smartphone aus: "
                br()
                link(URL(deepLink))
            }
            p {
                +"Hinweis: Die Vorab-Aktivierung wird nicht auf allen Endgeräten unterstützt. "
                +"Sollte der Vorgang also nicht erfolgreich sein, "
                +"warten Sie bitte auf das offizielle Schreiben, das alle notwendigen Informationen enthält."
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
