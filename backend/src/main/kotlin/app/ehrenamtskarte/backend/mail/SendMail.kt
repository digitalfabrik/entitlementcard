package app.ehrenamtskarte.backend.mail

import app.ehrenamtskarte.backend.config.SmtpConfig
import org.simplejavamail.email.EmailBuilder
import org.simplejavamail.mailer.MailerBuilder

fun sendMail(smtpConfig: SmtpConfig, fromName: String, to: String, subject: String, message: String) {
    MailerBuilder.withSMTPServer(smtpConfig.host, smtpConfig.port, smtpConfig.username, smtpConfig.password)
        .buildMailer()
        .sendMail(
            EmailBuilder
                .startingBlank()
                .to(to)
                .from(fromName, smtpConfig.username)
                .withSubject(subject)
                .withPlainText(message)
                .buildEmail()
        ).join()
}
