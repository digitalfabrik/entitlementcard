package xyz.elitese.ehrenamtskarte.importer.freinet

import xyz.elitese.ehrenamtskarte.importer.general.HttpDownloadHelper

object FreinetDataImporter {

    fun import() {
        val url = FreinetDataImporter::class.java.getResource("/freinet_import/secrets/import_all.txt").readText()
        val json = HttpDownloadHelper.downloadData(url)
        AcceptingStoresImporter.importFromJsonFile(json)
    }

}
