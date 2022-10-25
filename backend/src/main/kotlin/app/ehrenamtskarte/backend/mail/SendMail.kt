package app.ehrenamtskarte.backend.mail

fun sendMail(to: String, subject: String, message: String) {
    println("SENDING PSEUDO MAIL TO $to\nSUBJECT: $subject\n$message")
}
