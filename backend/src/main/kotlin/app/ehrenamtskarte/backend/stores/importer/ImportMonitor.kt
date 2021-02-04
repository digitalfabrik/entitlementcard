package app.ehrenamtskarte.backend.stores.importer

data class ImportMonitor(val messages: List<String>) {

    fun addMessages(message: String) = ImportMonitor({
        val currentMessages = messages.toMutableList()
        currentMessages.add(message)
        currentMessages
    }())

}

fun ImportMonitor() = ImportMonitor(emptyList())
