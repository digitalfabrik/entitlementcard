package xyz.elitese.ehrenamtskarte.stores.importer.freinet

import xyz.elitese.ehrenamtskarte.stores.importer.general.HttpDownloadHelper

object FreinetDataImporter {

    fun import() {
        val urlPrefix = System.getProperty("app.importer.json_1")
        val urlSufix = System.getProperty("app.importer.json_2")
        val token = FreinetDataImporter::class.java.getResource("/freinet_import/secret.txt").readText().trim()

        val json = HttpDownloadHelper.downloadData(urlPrefix + token + urlSufix)
        AcceptingStoresImporter.importFromJsonFile(json)
    }

}
