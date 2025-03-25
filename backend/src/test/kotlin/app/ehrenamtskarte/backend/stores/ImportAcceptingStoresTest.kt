package app.ehrenamtskarte.backend.stores

import app.ehrenamtskarte.backend.GraphqlApiTest
import app.ehrenamtskarte.backend.generated.ImportAcceptingStores
import app.ehrenamtskarte.backend.generated.inputs.CSVAcceptingStoreInput
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestData
import app.ehrenamtskarte.backend.stores.database.AcceptingStoreEntity
import app.ehrenamtskarte.backend.stores.database.AcceptingStores
import app.ehrenamtskarte.backend.stores.database.AddressEntity
import app.ehrenamtskarte.backend.stores.database.Addresses
import app.ehrenamtskarte.backend.stores.database.ContactEntity
import app.ehrenamtskarte.backend.stores.database.Contacts
import app.ehrenamtskarte.backend.stores.database.PhysicalStoreEntity
import app.ehrenamtskarte.backend.stores.database.PhysicalStores
import io.javalin.testtools.JavalinTest
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

internal class ImportAcceptingStoresTest : GraphqlApiTest() {

    private val projectStoreManager = TestAdministrators.NUERNBERG_PROJECT_STORE_MANAGER
    private val projectAdmin = TestAdministrators.NUERNBERG_PROJECT_ADMIN

    @BeforeEach
    fun cleanUp() {
        transaction {
            PhysicalStores.deleteAll()
            Addresses.deleteAll()
            AcceptingStores.deleteAll()
            Contacts.deleteAll()
        }
    }

    @Test
    fun `POST returns an error when project does not exist`() = JavalinTest.test(app) { _, client ->
        val mutation = createMutation(
            project = "non-existent.ehrenamtskarte.app",
            stores = emptyList()
        )
        val response = post(client, mutation, projectStoreManager.getJwtToken())

        assertEquals(404, response.code)
    }

    @Test
    fun `POST returns an error when the auth token is missing`() = JavalinTest.test(app) { _, client ->
        val mutation = createMutation(stores = emptyList())
        val response = post(client, mutation)

        assertEquals(401, response.code)
    }

    @Test
    fun `POST returns an error when the user is not allowed to import stores`() = JavalinTest.test(app) { _, client ->
        val mutation = createMutation(stores = emptyList())
        val response = post(client, mutation, projectAdmin.getJwtToken())

        assertEquals(403, response.code)
    }

    @Test
    fun `POST returns an error response if no unique region can be found for a project`() = JavalinTest.test(app) { _, client ->
        val csvStore = createAcceptingStoreInput(
            name = "Test store",
            street = "Teststr.",
            houseNumber = "10",
            postalCode = "90408",
            location = "Nürnberg",
            latitude = "0",
            longitude = "0",
            telephone = "0911/123456",
            email = "info@test.de",
            homepage = "https://www.test.de/kontakt/",
            discountDE = "20% Ermäßigung",
            discountEN = "20% discount",
            categoryId = "17"
        )
        val mutation = createMutation(project = "bayern.ehrenamtskarte.app", stores = listOf(csvStore))
        val response = post(client, mutation, projectStoreManager.getJwtToken())

        assertEquals(403, response.code)
    }

    @Test
    fun `POST returns a successful response if the list of accepting stores is empty`() = JavalinTest.test(app) { _, client ->
        val mutation = createMutation(stores = emptyList())
        val response = post(client, mutation, projectStoreManager.getJwtToken())

        assertEquals(200, response.code)

        val jsonResponse = response.json()

        jsonResponse.apply {
            assertEquals(0, findValue("storesCreated").intValue())
            assertEquals(0, findValue("storesDeleted").intValue())
            assertEquals(0, findValue("storesUntouched").intValue())
        }
    }

    @Test
    fun `POST returns a successful response if one accepting store with all fields has been created`() = JavalinTest.test(app) { _, client ->
        val csvStore = CSVAcceptingStoreInput(
            name = "Test store",
            street = "Teststr.",
            houseNumber = "10",
            postalCode = "90408",
            location = "Nürnberg",
            latitude = "0",
            longitude = "0",
            telephone = "0911/123456",
            email = "info@test.de",
            homepage = "https://www.test.de/kontakt/",
            discountDE = "20% Ermäßigung",
            discountEN = "20% discount",
            categoryId = "17"
        )
        val mutation = createMutation(stores = listOf(csvStore))
        val response = post(client, mutation, projectStoreManager.getJwtToken())

        assertEquals(200, response.code)

        val jsonResponse = response.json()

        jsonResponse.apply {
            assertEquals(1, findValue("storesCreated").intValue())
            assertEquals(0, findValue("storesDeleted").intValue())
            assertEquals(0, findValue("storesUntouched").intValue())
        }

        transaction {
            val acceptanceStore = AcceptingStoreEntity.all().single()

            assertEquals("Test store", acceptanceStore.name)
            assertEquals("20% Ermäßigung\n\n20% discount", acceptanceStore.description)
            assertEquals(17, acceptanceStore.categoryId.value)
            assertEquals(2, acceptanceStore.projectId.value)
            assertEquals(94, acceptanceStore.regionId?.value)
            assertNotNull(acceptanceStore.createdDate)

            val contact = ContactEntity.all().single()

            assertEquals(acceptanceStore.contactId, contact.id)
            assertEquals("info@test.de", contact.email)
            assertEquals("0911/123456", contact.telephone)
            assertEquals("https://www.test.de/kontakt/", contact.website)

            val address = AddressEntity.all().single()

            assertEquals("Teststr. 10", address.street)
            assertEquals("90408", address.postalCode)
            assertEquals("Nürnberg", address.location)
            assertEquals("de", address.countryCode)

            val physicalStore = PhysicalStoreEntity.all().single()

            assertEquals("(0 0)", physicalStore.coordinates.value)
            assertEquals(address.id, physicalStore.addressId)
            assertEquals(acceptanceStore.id, physicalStore.storeId)
        }
    }

    @Test
    fun `POST returns a successful response if one accepting store with only mandatory fields has been created`() = JavalinTest.test(app) { _, client ->
        val csvStore = CSVAcceptingStoreInput(
            name = "Test store",
            street = "Teststr.",
            houseNumber = "10",
            postalCode = "90408",
            location = "Nürnberg",
            latitude = "0",
            longitude = "0",
            telephone = "",
            email = "",
            homepage = "",
            discountDE = "",
            discountEN = "",
            categoryId = "17"
        )
        val mutation = createMutation(stores = listOf(csvStore))
        val response = post(client, mutation, projectStoreManager.getJwtToken())

        assertEquals(200, response.code)

        val jsonResponse = response.json()

        jsonResponse.apply {
            assertEquals(1, findValue("storesCreated").intValue())
            assertEquals(0, findValue("storesDeleted").intValue())
            assertEquals(0, findValue("storesUntouched").intValue())
        }

        transaction {
            val acceptanceStore = AcceptingStoreEntity.all().single()

            assertEquals("Test store", acceptanceStore.name)
            assertNull(acceptanceStore.description)
            assertEquals(17, acceptanceStore.categoryId.value)
            assertEquals(2, acceptanceStore.projectId.value)
            assertEquals(94, acceptanceStore.regionId?.value)
            assertNotNull(acceptanceStore.createdDate)

            val contact = ContactEntity.all().single()

            assertEquals(acceptanceStore.contactId, contact.id)
            assertNull(contact.email)
            assertNull(contact.telephone)
            assertNull(contact.website)

            val address = AddressEntity.all().single()

            assertEquals("Teststr. 10", address.street)
            assertEquals("90408", address.postalCode)
            assertEquals("Nürnberg", address.location)
            assertEquals("de", address.countryCode)

            val physicalStore = PhysicalStoreEntity.all().single()

            assertEquals("(0 0)", physicalStore.coordinates.value)
            assertEquals(address.id, physicalStore.addressId)
            assertEquals(acceptanceStore.id, physicalStore.storeId)
        }
    }

    @Test
    fun `POST returns a successful response if two duplicate acceptance stores are submitted`() = JavalinTest.test(app) { _, client ->
        val csvStore = CSVAcceptingStoreInput(
            name = "Test store",
            street = "Teststr.",
            houseNumber = "10",
            postalCode = "90408",
            location = "Nürnberg",
            latitude = "0",
            longitude = "0",
            telephone = "0911/123456",
            email = "info@test.de",
            homepage = "https://www.test.de/kontakt/",
            discountDE = "20% Ermäßigung",
            discountEN = "20% discount",
            categoryId = "17"
        )
        val mutation = createMutation(stores = listOf(csvStore, csvStore))
        val response = post(client, mutation, projectStoreManager.getJwtToken())

        assertEquals(200, response.code)

        val jsonResponse = response.json()

        jsonResponse.apply {
            assertEquals(1, findValue("storesCreated").intValue())
            assertEquals(0, findValue("storesDeleted").intValue())
            assertEquals(1, findValue("storesUntouched").intValue())
        }

        transaction {
            assertEquals(1, AcceptingStores.selectAll().count())
            assertEquals(1, Contacts.selectAll().count())
            assertEquals(1, Addresses.selectAll().count())
            assertEquals(1, PhysicalStores.selectAll().count())
        }
    }

    @Test
    fun `POST returns a successful response if one store has been created and another one has been deleted`() = JavalinTest.test(app) { _, client ->
        TestData.createAcceptingStore()
        val newStore = CSVAcceptingStoreInput(
            name = "Test store 2",
            street = "Teststr.",
            houseNumber = "10",
            postalCode = "90408",
            location = "Nürnberg",
            latitude = "0",
            longitude = "0",
            telephone = "0911/123456",
            email = "info@test.de",
            homepage = "https://www.test.de/kontakt/",
            discountDE = "20% Ermäßigung",
            discountEN = "20% discount",
            categoryId = "17"
        )
        val mutation = createMutation(stores = listOf(newStore))
        val response = post(client, mutation, projectStoreManager.getJwtToken())

        assertEquals(200, response.code)

        val jsonResponse = response.json()

        jsonResponse.apply {
            assertEquals(1, findValue("storesCreated").intValue())
            assertEquals(1, findValue("storesDeleted").intValue())
            assertEquals(0, findValue("storesUntouched").intValue())
        }

        transaction {
            AcceptingStores.selectAll().single().let {
                assertEquals("Test store 2", it[AcceptingStores.name])
            }
            assertEquals(1, Contacts.selectAll().count())
            assertEquals(1, Addresses.selectAll().count())
            assertEquals(1, PhysicalStores.selectAll().count())
        }
    }

    @Test
    fun `POST returns a successful response if nothing has changed`() = JavalinTest.test(app) { _, client ->
        val oldStore = TestData.createAcceptingStore()
        val newStore = CSVAcceptingStoreInput(
            name = oldStore.name,
            street = "Teststr.",
            houseNumber = "10",
            postalCode = "90408",
            location = "Nürnberg",
            latitude = "0",
            longitude = "0",
            telephone = "0911/123456",
            email = "info@test.de",
            homepage = "https://www.test.de",
            discountDE = "100% Ermäßigung",
            discountEN = "100% discount",
            categoryId = "17"
        )
        val mutation = createMutation(stores = listOf(newStore))
        val response = post(client, mutation, projectStoreManager.getJwtToken())

        assertEquals(200, response.code)

        val jsonResponse = response.json()

        jsonResponse.apply {
            assertEquals(0, findValue("storesCreated").intValue())
            assertEquals(0, findValue("storesDeleted").intValue())
            assertEquals(1, findValue("storesUntouched").intValue())
        }

        transaction {
            assertEquals(1, AcceptingStores.selectAll().count())
            assertEquals(1, Contacts.selectAll().count())
            assertEquals(1, Addresses.selectAll().count())
            assertEquals(1, PhysicalStores.selectAll().count())
        }
    }

    private fun createMutation(
        project: String = "nuernberg.sozialpass.app",
        dryRun: Boolean = false,
        stores: List<CSVAcceptingStoreInput>
    ): ImportAcceptingStores {
        val variables = ImportAcceptingStores.Variables(
            project = project,
            dryRun = dryRun,
            stores = stores
        )
        return ImportAcceptingStores(variables)
    }
}
