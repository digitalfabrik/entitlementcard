package xyz.elitese.ehrenamtskarte.importer.general

import com.beust.klaxon.Klaxon
import org.apache.commons.text.StringEscapeUtils
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.transactions.transaction
import org.postgis.Point
import xyz.elitese.ehrenamtskarte.database.*
import xyz.elitese.ehrenamtskarte.importer.freinet.AcceptingStoresImporter

object ImportToDatabase {
    fun prepareCategories() {
        val categoriesJson = AcceptingStoresImporter::class.java
            .getResource("/freinet_import/categories.json").readText()
        val categories = Klaxon().parseArray<Category>(categoriesJson)!!

        transaction {
            categories.forEach { CategoryEntity.new(it.id) { name = it.name } }
        }
    }

    private fun decodeSpecialCharacters(text: String): String {
        // We often get a double encoded string, i.e. &amp;amp;
        return StringEscapeUtils.unescapeHtml4(
            StringEscapeUtils.unescapeHtml4(
                text
            )
        ).replace("<br/>", "\n")
    }

    /**
     * Replaces notes for unspecified entries with empty strings.
     *
     * Such a note consists of the letters "nA" (in that order), potentially with dots like "n.A." and/or stuffed with whitespace (e.g. " n A. ").
     *
     * @return empty string if `text` is a "unspecified note", `text` otherwise
     */
    private fun replaceUnspecifiedNote(text: String): String {
        return if (Regex("""\s*n\.?\s*A\.?\s*""").matches(text)) "" else text
    }

    fun import(acceptingStores: List<GenericImportAcceptingStore>) {
        println("Inserting data into db")
        try {
            for (acceptingStore in acceptingStores) {
                transaction {
                    val address = AddressEntity.new {
                        street = replaceUnspecifiedNote(acceptingStore.street)
                        postalCode = replaceUnspecifiedNote(acceptingStore.postalCode)
                        locaction = replaceUnspecifiedNote(acceptingStore.location)
                        countryCode = acceptingStore.countryCode
                    }
                    val contact = ContactEntity.new {
                        email = replaceUnspecifiedNote(acceptingStore.email)
                        telephone = replaceUnspecifiedNote(acceptingStore.telephone)
                        website = replaceUnspecifiedNote(acceptingStore.website)
                    }
                    val store = AcceptingStoreEntity.new {
                        name = replaceUnspecifiedNote(decodeSpecialCharacters(acceptingStore.name))
                        description = replaceUnspecifiedNote(decodeSpecialCharacters(acceptingStore.discount))
                        contactId = contact.id
                        categoryId = EntityID(acceptingStore.categoryId, Categories)
                    }
                    PhysicalStoreEntity.new {
                        storeId = store.id
                        addressId = address.id
                        coordinates = Point(acceptingStore.longitude, acceptingStore.latitude)
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
