package app.ehrenamtskarte.backend.shared.mail

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.config.ProjectConfig
import app.ehrenamtskarte.backend.config.SmtpConfig
import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.db.repositories.AdministratorsRepository
import app.ehrenamtskarte.backend.graphql.application.types.PersonalData
import app.ehrenamtskarte.backend.graphql.shared.exceptions.MailNotSentException
import com.sanctionco.jmail.JMail
import org.simplejavamail.MailException
import org.simplejavamail.email.EmailBuilder
import org.simplejavamail.mailer.MailerBuilder
import org.slf4j.LoggerFactory
import java.net.URI
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

private val logger by lazy { LoggerFactory.getLogger(Mailer::class.java) }

object Mailer {
    fun sendNotificationForApplicationMails(
        project: String,
        backendConfig: BackendConfiguration,
        projectConfig: ProjectConfig,
        regionId: Int,
    ) {
        val recipients = AdministratorsRepository
            .getNotificationRecipientsForApplication(project, regionId)

        for (recipient: AdministratorEntity in recipients) {
            try {
                sendMail(
                    backendConfig = backendConfig,
                    smtpConfig = projectConfig.smtp,
                    fromName = projectConfig.administrationName,
                    to = recipient.email,
                    subject = "Ein neuer Antrag ist eingegangen",
                    message = emailBody {
                        p { +"Guten Tag," }
                        p { +"ein neuer Antrag liegt in ${projectConfig.administrationName} vor." }

                        viewApplicationsParagraph(projectConfig)
                        adjustNotificationsParagraph(projectConfig)
                        finalInformationParagraph(projectConfig)
                    },
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
        val recipients = AdministratorsRepository
            .getNotificationRecipientsForVerification(project, regionId)

        for (recipient: AdministratorEntity in recipients) {
            try {
                sendMail(
                    backendConfig = backendConfig,
                    smtpConfig = projectConfig.smtp,
                    fromName = projectConfig.administrationName,
                    to = recipient.email,
                    subject = "Ein Antrag wurde verifiziert",
                    message = emailBody {
                        p { +"Guten Tag," }
                        p { +"ein Antrag wurde verifiziert." }
                        viewApplicationsParagraph(projectConfig)
                        adjustNotificationsParagraph(projectConfig)
                        finalInformationParagraph(projectConfig)
                    },
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
        sendMail(
            backendConfig = backendConfig,
            smtpConfig = projectConfig.smtp,
            fromName = projectConfig.administrationName,
            to = applicationVerification.contactEmailAddress,
            subject = "Bestätigung der Angaben für den Antrag auf eine Ehrenamtskarte von $applicantName",
            message = emailBody {
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
                    link(verificationLink(projectConfig, applicationVerification))
                }
                p {
                    +"Hinweis: Die Website ist durch eine sichere Verbindung geschützt. "
                    +"Sie müssen keine persönlichen Daten eingeben."
                }
                finalInformationParagraph(projectConfig)
            },
        )
    }

    fun sendApplicationApplicantMail(
        backendConfig: BackendConfiguration,
        projectConfig: ProjectConfig,
        personalData: PersonalData,
        accessKey: String,
        applicationConfirmationNote: String?,
    ) {
        sendMail(
            backendConfig = backendConfig,
            smtpConfig = projectConfig.smtp,
            fromName = projectConfig.administrationName,
            to = personalData.emailAddress.email,
            subject = "Ihr Antrag für die Ehrenamtskarte Bayern ist eingegangen",
            message = emailBody {
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
                    link(reviewApplicationLink(projectConfig, accessKey))
                }
                applicationConfirmationNoteParagraph(applicationConfirmationNote)
                p {
                    +"Falls Sie Fragen zu Ihrem Antrag haben oder Unterstützung benötigen, "
                    +"wenden Sie sich bitte direkt an das örtliche Landratsamt bzw. die Verwaltung Ihrer kreisfreien "
                    +"Stadt."
                }
                finalInformationParagraph(projectConfig)
            },
        )
    }

    fun sendApplicationMailToContactPerson(
        backendConfig: BackendConfiguration,
        projectConfig: ProjectConfig,
        contactPerson: String,
        contactEmailAddress: String,
        personalData: PersonalData,
        accessKey: String,
        applicationConfirmationNote: String?,
    ) {
        sendMail(
            backendConfig = backendConfig,
            smtpConfig = projectConfig.smtp,
            fromName = projectConfig.administrationName,
            to = contactEmailAddress,
            subject = "Antrag erfolgreich eingereicht",
            message = emailBody {
                p { +"Sehr geehrte/r $contactPerson," }
                p {
                    +"Ihr Antrag auf die Bayerische Ehrenamtskarte für ${personalData.forenames.shortText} "
                    +"${personalData.surname.shortText} wurde erfolgreich eingereicht."
                }
                p {
                    +"Den aktuellen Status Ihres Antrags können Sie jederzeit unter folgendem Link einsehen. "
                    +"Dort haben Sie auch die Möglichkeit, Ihren Antrag bei Bedarf zurückzuziehen:"
                    br()
                    link(reviewApplicationLink(projectConfig, accessKey))
                }
                applicationConfirmationNoteParagraph(applicationConfirmationNote)
                p {
                    +"Bei Rückfragen wenden Sie sich bitte direkt an Ihr zuständiges Landratsamt oder die "
                    +"Verwaltung Ihrer kreisfreien Stadt."
                }
                finalInformationParagraph(projectConfig)
            },
        )
    }

    fun sendResetPasswordMail(
        backendConfig: BackendConfiguration,
        projectConfig: ProjectConfig,
        passwortResetKey: String,
        recipient: String,
    ) {
        sendMail(
            backendConfig = backendConfig,
            smtpConfig = projectConfig.smtp,
            fromName = projectConfig.administrationName,
            to = recipient,
            subject = "Passwort Zurücksetzen",
            message = emailBody {
                p { +"Guten Tag," }
                p { +"Sie haben angefragt, Ihr Passwort für ${projectConfig.administrationName} zurückzusetzen." }
                p {
                    +"Sie können Ihr Passwort unter dem folgenden Link zurücksetzen:"
                    br()
                    link(resetPasswordLink(projectConfig, recipient, passwortResetKey))
                }
                p { +"Dieser Link ist 24 Stunden gültig." }
                finalInformationParagraph(projectConfig)
            },
        )
    }

    fun sendWelcomeMail(
        backendConfig: BackendConfiguration,
        projectConfig: ProjectConfig,
        passwordResetKey: String,
        recipient: String,
    ) {
        sendMail(
            backendConfig = backendConfig,
            smtpConfig = projectConfig.smtp,
            fromName = projectConfig.administrationName,
            to = recipient,
            subject = "Kontoerstellung",
            message = emailBody {
                p { +"Guten Tag," }
                p { +"für Sie wurde ein Account für ${projectConfig.administrationName} erstellt." }
                p {
                    +"Sie können Ihr Passwort unter dem folgenden Link setzen:"
                    br()
                    link(resetPasswordLink(projectConfig, recipient, passwordResetKey))
                }
                p { +"Dieser Link ist 24 Stunden gültig." }
                finalInformationParagraph(projectConfig)
            },
        )
    }

    fun sendCardCreationConfirmationMail(
        backendConfig: BackendConfiguration,
        projectConfig: ProjectConfig,
        deepLink: String,
        recipientAddress: String,
        recipientName: String,
    ) {
        sendMail(
            backendConfig = backendConfig,
            smtpConfig = projectConfig.smtp,
            fromName = projectConfig.administrationName,
            to = recipientAddress,
            subject = "Ihr Antrag für die Ehrenamtskarte Bayern wurde bewilligt",
            message = emailBody {
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
                    link(URI.create(deepLink))
                }
                p {
                    +"Hinweis: Die Vorab-Aktivierung wird nicht auf allen Endgeräten unterstützt. "
                    +"Sollte der Vorgang also nicht erfolgreich sein, "
                    +"warten Sie bitte auf das offizielle Schreiben, das alle notwendigen Informationen enthält."
                }
                finalInformationParagraph(projectConfig)
            },
        )
    }

    fun sendApplicationRejectedMail(
        backendConfig: BackendConfiguration,
        projectConfig: ProjectConfig,
        applicantName: String,
        applicantAddress: String,
        rejectionMessage: String,
    ) {
        try {
            sendMail(
                backendConfig = backendConfig,
                smtpConfig = projectConfig.smtp,
                fromName = projectConfig.administrationName,
                to = applicantAddress,
                subject = "Ihr Antrag wurde abgelehnt",
                message = emailBody {
                    p { +"Sehr geehrte/r $applicantName," }
                    p {
                        +"""
                        vielen Dank für Ihren Antrag und Ihr Interesse an der Bayerischen Ehrenamtskarte. Wir danken 
                        Ihnen für das Engagement und die Zeit, die Sie zum Wohle der Gemeinschaft einbringen. Ihr 
                        Einsatz ist von großem Wert und verdient Anerkennung. In diesem Fall ist es leider nicht 
                        möglich, dass Sie die Bayerische Ehrenamtskarte erhalten.                            
                        """.trimIndent()
                    }
                    p { +rejectionMessage }
                    finalInformationParagraph(projectConfig)
                },
            )
        } catch (_: MailNotSentException) {
        }
    }
}

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
        link(URI.create("${projectConfig.administrationBaseUrl}/user-settings"))
    }
}

private fun EmailBody.viewApplicationsParagraph(projectConfig: ProjectConfig) {
    p {
        +"Unter folgendem Link können Sie Anträge einsehen und bearbeiten:"
        br()
        link(URI.create("${projectConfig.administrationBaseUrl}/applications"))
    }
}

private fun EmailBody.applicationConfirmationNoteParagraph(note: String?) {
    if (!note.isNullOrBlank()) {
        p {
            plain(note)
        }
    }
}

private fun sendMail(
    backendConfig: BackendConfiguration,
    smtpConfig: SmtpConfig,
    fromName: String,
    to: String,
    subject: String,
    message: EmailBody,
) {
    // Skip sending emails for cases like e2e tests
    if (backendConfig.disableMailService) {
        return
    }

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
        MailerBuilder.withSMTPServer(smtpConfig.host, smtpConfig.port, smtpConfig.username, smtpConfig.password)
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
            )
            .join()
    } catch (exception: MailException) {
        logger.error(exception.message)
        throw MailNotSentException(to)
    }
}

private fun resetPasswordLink(projectConfig: ProjectConfig, recipient: String, passwortResetKey: String): URI =
    URI.create(
        "${projectConfig.administrationBaseUrl}/reset-password?" +
            "email=${urlEncode(recipient)}&token=${urlEncode(passwortResetKey)}",
    )

private fun reviewApplicationLink(projectConfig: ProjectConfig, accessKey: String): URI =
    URI.create("${projectConfig.administrationBaseUrl}/antrag-einsehen/${urlEncode(accessKey)}")

private fun verificationLink(
    projectConfig: ProjectConfig,
    applicationVerification: ApplicationVerificationEntity,
): URI =
    URI.create(
        "${projectConfig.administrationBaseUrl}/antrag-verifizieren/${urlEncode(applicationVerification.accessKey)}",
    )

private fun urlEncode(str: String) = URLEncoder.encode(str, StandardCharsets.UTF_8)
