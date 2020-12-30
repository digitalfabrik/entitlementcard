package xyz.elitese.ehrenamtskarte.importer.lbe

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.dataformat.xml.XmlMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import java.io.File
import xyz.elitese.ehrenamtskarte.importer.general.GenericImportAcceptingStore
import xyz.elitese.ehrenamtskarte.importer.general.HttpDownloadHelper
import xyz.elitese.ehrenamtskarte.importer.general.ImportToDatabase
import xyz.elitese.ehrenamtskarte.importer.lbe.types.LbeAcceptingStore
import xyz.elitese.ehrenamtskarte.importer.lbe.types.LbeData

object LbeDataImporter {

    fun import() {
        val url = System.getProperty("app.import.xml")
        val xml = HttpDownloadHelper.downloadData(url)

        val xmlMapper = XmlMapper()
        xmlMapper.registerModule(KotlinModule())
        xmlMapper.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT)
        val lbeData = xmlMapper.readValue(xml, LbeData::class.java)

        val filterReport = File("filterReport.txt")
        val filteredStores = lbeData.acceptingStores.filter { filter(it, filterReport) }

        val acceptingStores = filteredStores
                .map { GenericImportAcceptingStore(it) }

        ImportToDatabase.prepareCategories()
        ImportToDatabase.import(acceptingStores)
    }

    private fun filter(store: LbeAcceptingStore, filterReport: File): Boolean {
        val filter = store.latitude.isNotEmpty()
                && store.longitude.isNotEmpty()
                && store.postalCode.length == 5
                && store.category.toInt() >= 0
                && store.category.toInt() <= 8

        if (!filter)
            filterReport.appendText(store.toString() + '\n')

        return filter
    }

}
