package app.ehrenamtskarte.backend.stores.importer

import java.time.LocalDateTime

class ImportMonitor {

    val messages = ArrayList<String>()

    fun addMessage(message: String) = messages.add("[" + LocalDateTime.now() + "]" + message.prependIndent("\n\n"))

    fun addMessage(message: String, e: Exception) = addMessage("$message:\n$e")

}
