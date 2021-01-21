package xyz.elitese.ehrenamtskarte.stores.importer.lbe

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.dataformat.xml.XmlMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import xyz.elitese.ehrenamtskarte.stores.importer.general.GenericImportAcceptingStore
import xyz.elitese.ehrenamtskarte.stores.importer.general.HttpDownloadHelper
import xyz.elitese.ehrenamtskarte.stores.importer.general.ImportToDatabase
import xyz.elitese.ehrenamtskarte.stores.importer.lbe.types.LbeAcceptingStore
import xyz.elitese.ehrenamtskarte.stores.importer.lbe.types.LbeData
import java.io.File

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
        val category = store.category
        val filter = !store.latitude.isNullOrBlank()
                && !store.longitude.isNullOrBlank()
                && (store.postalCode == null || store.postalCode?.trim()?.length == 5)
                && !category.isNullOrBlank()
                && try {
                        !category.isNullOrBlank() && category.toInt() in 0..8
                    } catch (nfe: NumberFormatException) {
                        false
                    }

        if (!filter)
            filterReport.appendText(store.toString() + '\n')

        return filter
    }

}
