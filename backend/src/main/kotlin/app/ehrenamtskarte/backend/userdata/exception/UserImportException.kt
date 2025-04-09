package app.ehrenamtskarte.backend.userdata.exception

class UserImportException : Exception {
    constructor(message: String) : super(message)

    constructor(lineNumber: Long, message: String) : super("Error at line $lineNumber: $message")
}
