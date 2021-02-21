package app.ehrenamtskarte.backend.stores.importer

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class ImportMonitor(val writeToStout: Boolean) {

    val messages = ArrayList<String>()

    fun addMessage(message: String) {
        val wrappedMessage = "[" + LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) + "]" + "\t" + message
        if (writeToStout)
            println(wrappedMessage)
        else
            messages.add(wrappedMessage)
    }

    fun addMessage(message: String, e: Exception) = addMessage("$message:\n$e")

}
