package app.ehrenamtskarte.backend.freinet.util

import com.fasterxml.jackson.databind.node.ObjectNode

fun ObjectNode.addFreinetInitInformation(agencyId: Int, accessKey: String, moduleName: String) {
    putObject("init").apply {
        put("apiVersion", "3.0")
        put("agencyID", agencyId)
        put("accessKey", accessKey)
        put("modul", moduleName)
        put("author", "TuerAnTuer")
        put("author_mail", "berechtigungskarte@tuerantuer.org")
    }
}
