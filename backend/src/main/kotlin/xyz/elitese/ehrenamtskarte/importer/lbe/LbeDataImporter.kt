package xyz.elitese.ehrenamtskarte.importer.lbe

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.dataformat.xml.XmlMapper
import xyz.elitese.ehrenamtskarte.importer.HttpDownloadHelper
import xyz.elitese.ehrenamtskarte.importer.lbe.types.LbeData

object LbeDataImporter {

    fun import() {
        val url = LbeDataImporter::class.java.getResource("/freinet_import/import_xml.txt").readText()
        val xml = HttpDownloadHelper.downloadData(url)

        val xmlMapper = XmlMapper()
        xmlMapper.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT)
        val lbeData = xmlMapper.readValue(xml, LbeData::class.java)

        lbeData.acceptingStores.forEach {
            println(it.name + " " + it.street)
        }
    }

}

fun main() {
    LbeDataImporter.import()
}

