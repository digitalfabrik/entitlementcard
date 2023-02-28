package app.ehrenamtskarte.backend.mail

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.config.SmtpConfig
import org.simplejavamail.email.EmailBuilder
import org.simplejavamail.mailer.MailerBuilder
import org.slf4j.LoggerFactory

object Mailer {

    fun sendMail(
        backendConfig: BackendConfiguration,
        smtpConfig: SmtpConfig,
        fromName: String,
        to: String,
        subject: String,
        message: String,
    ) {
        if (!backendConfig.production) {
            val logger = LoggerFactory.getLogger(Mailer::class.java)
            logger.info(
                """
                Sending Email:
                FromName: $fromName
                To: $to
                Subject: $subject
                -----------------------
                
                """.trimIndent() + message,
            )
        }
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
                    .buildEmail(),
            ).join()
    }
}
