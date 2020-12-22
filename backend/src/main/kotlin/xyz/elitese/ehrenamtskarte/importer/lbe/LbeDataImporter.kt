package xyz.elitese.ehrenamtskarte.importer.lbe

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.dataformat.xml.XmlMapper
import xyz.elitese.ehrenamtskarte.importer.general.GenericImportAcceptingStore
import xyz.elitese.ehrenamtskarte.importer.general.HttpDownloadHelper
import xyz.elitese.ehrenamtskarte.importer.general.ImportToDatabase
import xyz.elitese.ehrenamtskarte.importer.lbe.types.LbeData

object LbeDataImporter {

    fun import() {
        val url = LbeDataImporter::class.java.getResource("/freinet_import/import_xml.txt").readText()
        val xml = HttpDownloadHelper.downloadData(url)

        val xmlMapper = XmlMapper()
        xmlMapper.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT)
        val lbeData = xmlMapper.readValue(xml, LbeData::class.java)

        val acceptingStores = lbeData.acceptingStores.map { GenericImportAcceptingStore(it) }
        ImportToDatabase.import(acceptingStores)
    }

}
