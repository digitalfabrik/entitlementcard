package xyz.elitese.ehrenamtskarte.stores.importer.general

import com.beust.klaxon.Klaxon
import org.apache.commons.text.StringEscapeUtils
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.transactions.transaction
import org.postgis.Point
import xyz.elitese.ehrenamtskarte.stores.database.*
import xyz.elitese.ehrenamtskarte.stores.importer.freinet.AcceptingStoresImporter

object ImportToDatabase {
    private val unspecifiedNoteRegex = Regex("""^\s*(n\.?\s*A\.?|)\s*$""")

    fun prepareCategories() {
        val categoriesJson = AcceptingStoresImporter::class.java
            .getResource("/freinet_import/categories.json").readText()
        val categories = Klaxon().parseArray<Category>(categoriesJson)!!

        transaction {
            categories.forEach { CategoryEntity.new(it.id) { name = it.name } }
        }
    }

    private fun String.decodeSpecialCharacters(): String {
        // We often get a double encoded string, i.e. &amp;amp;
        return StringEscapeUtils.unescapeHtml4(
            StringEscapeUtils.unescapeHtml4(
                this
            )
        ).replace("<br/>", "\n")
    }

    /**
     * Replaces notes for unspecified entries with `null` and trims the String otherwise.
     *
     * Such a note consists of the letters "nA" (in that order), potentially with dots like "n.A." and/or stuffed with
     * whitespace (e.g. " n A. "), or of whitespace only.
     *
     * @return `null` if `text` is a "unspecified note", trimmed `text` otherwise
     * @see String.trim
     */
    private fun String.sanitizeForDb(): String? {
        return if (unspecifiedNoteRegex.matches(this)) null else this.trim()
    }

    fun import(acceptingStores: List<GenericImportAcceptingStore>) {
        println("Inserting data into db")
        try {
            for (acceptingStore in acceptingStores) {
                transaction {
                    val address = AddressEntity.new {
                        street = acceptingStore.street?.sanitizeForDb()
                        postalCode = acceptingStore.postalCode?.sanitizeForDb()
                        locaction = acceptingStore.location?.sanitizeForDb()
                        countryCode = acceptingStore.countryCode?.sanitizeForDb()
                    }
                    val contact = ContactEntity.new {
                        email = acceptingStore.email?.sanitizeForDb()
                        telephone = acceptingStore.telephone?.sanitizeForDb()
                        website = acceptingStore.website?.sanitizeForDb()
                    }
                    val store = AcceptingStoreEntity.new {
                        name = acceptingStore.name?.decodeSpecialCharacters()?.sanitizeForDb()
                        description = acceptingStore.discount?.decodeSpecialCharacters()?.sanitizeForDb()
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
