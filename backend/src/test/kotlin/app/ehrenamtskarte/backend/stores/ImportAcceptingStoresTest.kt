package app.ehrenamtskarte.backend.stores

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.db.entities.AcceptingStoreEntity
import app.ehrenamtskarte.backend.db.entities.AcceptingStores
import app.ehrenamtskarte.backend.db.entities.AddressEntity
import app.ehrenamtskarte.backend.db.entities.Addresses
import app.ehrenamtskarte.backend.db.entities.ContactEntity
import app.ehrenamtskarte.backend.db.entities.Contacts
import app.ehrenamtskarte.backend.db.entities.PhysicalStoreEntity
import app.ehrenamtskarte.backend.db.entities.PhysicalStores
import app.ehrenamtskarte.backend.generated.ImportAcceptingStores
import app.ehrenamtskarte.backend.generated.inputs.CSVAcceptingStoreInput
import app.ehrenamtskarte.backend.helper.CSVAcceptanceStoreBuilder
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestData
import app.ehrenamtskarte.backend.helper.json
import app.ehrenamtskarte.backend.helper.toErrorObject
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.MethodSource
import org.springframework.http.HttpStatus
import kotlin.test.Ignore
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

internal class ImportAcceptingStoresTest : IntegrationTest() {
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
    fun `should return an error when the auth token is missing`() {
        val mutation = createMutation(stores = emptyList())
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Authorization token expired, invalid or missing", error.message)
    }

    @Test
    fun `should return an error when the user is not allowed to import stores`() {
        val mutation = createMutation(stores = emptyList())
        val response = postGraphQL(mutation, projectAdmin.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Insufficient access rights", error.message)
    }

    @Test
    fun `should return an error response if no unique region can be found for a project`() {
        val mutation = createMutation(
            stores = listOf(CSVAcceptanceStoreBuilder.build()),
        )
        val response = postGraphQL(mutation, TestAdministrators.EAK_PROJECT_STORE_MANAGER.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Error REGION_NOT_UNIQUE occurred.", error.message)
    }

    @Test
    fun `should return a successful response if the list of accepting stores is empty`() {
        val mutation = createMutation(stores = emptyList())
        val response = postGraphQL(mutation, projectStoreManager.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val data = response.json()

        assertEquals(0, data.findValue("storesCreated").asInt())
        assertEquals(0, data.findValue("storesDeleted").asInt())
        assertEquals(0, data.findValue("storesUntouched").asInt())
    }

    @Test
    fun `should return a successful response if one accepting store with all fields has been created`() {
        val mutation = createMutation(
            stores = listOf(CSVAcceptanceStoreBuilder.build()),
        )
        val response = postGraphQL(mutation, projectStoreManager.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val data = response.json()

        assertEquals(1, data.findValue("storesCreated").asInt())
        assertEquals(0, data.findValue("storesDeleted").asInt())
        assertEquals(0, data.findValue("storesUntouched").asInt())

        transaction {
            val acceptanceStore = AcceptingStoreEntity.all().single()

            assertEquals("Test store", acceptanceStore.name)
            assertEquals("100% Ermäßigung\n\n100% discount", acceptanceStore.description)
            assertEquals(17, acceptanceStore.categoryId.value)
            assertEquals(2, acceptanceStore.projectId.value)
            assertEquals(95, acceptanceStore.regionId?.value)
            assertNotNull(acceptanceStore.createdDate)

            val contact = ContactEntity.all().single()

            assertEquals(acceptanceStore.contactId, contact.id)
            assertEquals("info@test.de", contact.email)
            assertEquals("0911/123456", contact.telephone)
            assertEquals("https://www.test.de", contact.website)

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
    fun `should return a successful response if one accepting store with only mandatory fields has been created`() {
        val mutation = createMutation(
            stores = listOf(
                CSVAcceptanceStoreBuilder.build(
                    telephone = "",
                    email = "",
                    homepage = "",
                    discountDE = "",
                    discountEN = "",
                ),
            ),
        )
        val response = postGraphQL(mutation, projectStoreManager.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val data = response.json()

        assertEquals(1, data.findValue("storesCreated").asInt())
        assertEquals(0, data.findValue("storesDeleted").asInt())
        assertEquals(0, data.findValue("storesUntouched").asInt())

        transaction {
            val acceptanceStore = AcceptingStoreEntity.all().single()

            assertEquals("Test store", acceptanceStore.name)
            assertNull(acceptanceStore.description)
            assertEquals(17, acceptanceStore.categoryId.value)
            assertEquals(2, acceptanceStore.projectId.value)
            assertEquals(95, acceptanceStore.regionId?.value)
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
    fun `should return an error if two duplicate acceptance stores are submitted`() {
        val mutation = createMutation(
            stores = listOf(CSVAcceptanceStoreBuilder.build(), CSVAcceptanceStoreBuilder.build()),
        )
        val response = postGraphQL(mutation, projectStoreManager.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Error INVALID_JSON occurred.", error.message)
        assertEquals("Duplicate store(s) found: Test store Teststr. 10 90408 Nürnberg", error.extensions?.reason)
    }

    @Test
    fun `should return a successful response if one store has been created and another one has been deleted`() {
        TestData.createAcceptingStore()

        val mutation = createMutation(
            stores = listOf(CSVAcceptanceStoreBuilder.build(name = "Test store 2")),
        )
        val response = postGraphQL(mutation, projectStoreManager.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val data = response.json()

        assertEquals(1, data.findValue("storesCreated").asInt())
        assertEquals(1, data.findValue("storesDeleted").asInt())
        assertEquals(0, data.findValue("storesUntouched").asInt())

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
    fun `should return a successful response if nothing has changed`() {
        TestData.createAcceptingStore()

        val mutation = createMutation(
            stores = listOf(CSVAcceptanceStoreBuilder.build()),
        )
        val response = postGraphQL(mutation, projectStoreManager.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val data = response.json()

        assertEquals(0, data.findValue("storesCreated").asInt())
        assertEquals(0, data.findValue("storesDeleted").asInt())
        assertEquals(1, data.findValue("storesUntouched").asInt())

        transaction {
            assertEquals(1, AcceptingStores.selectAll().count())
            assertEquals(1, Contacts.selectAll().count())
            assertEquals(1, Addresses.selectAll().count())
            assertEquals(1, PhysicalStores.selectAll().count())
        }
    }

    data class ValidationErrorTestCase(val csvStore: CSVAcceptingStoreInput, val error: String)

    companion object {
        @JvmStatic
        fun validationErrorTestCases(): List<ValidationErrorTestCase> {
            val blankValues = listOf("", " ")
            val builders: Map<String, (String) -> CSVAcceptingStoreInput> = mapOf(
                "name" to { value -> CSVAcceptanceStoreBuilder.build(name = value) },
                "location" to { value -> CSVAcceptanceStoreBuilder.build(location = value) },
                "street" to { value -> CSVAcceptanceStoreBuilder.build(street = value) },
                "houseNumber" to { value -> CSVAcceptanceStoreBuilder.build(houseNumber = value) },
                "postalCode" to { value -> CSVAcceptanceStoreBuilder.build(postalCode = value) },
            )
            return builders.flatMap { (fieldName, builder) ->
                blankValues.map { value ->
                    ValidationErrorTestCase(
                        csvStore = builder(value),
                        error = "Empty string passed for required property: $fieldName",
                    )
                }
            }
        }
    }

    @Ignore("TODO fix exception handling")
    @ParameterizedTest
    @MethodSource("validationErrorTestCases")
    fun `should return validation error when the csv store input is not valid`(testCase: ValidationErrorTestCase) {
        val mutation = createMutation(
            stores = listOf(testCase.csvStore),
        )
        val response = postGraphQL(mutation, projectStoreManager.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Error INVALID_JSON occurred.", error.message)
        assertEquals(testCase.error, error.extensions?.reason)
    }

    private fun createMutation(dryRun: Boolean = false, stores: List<CSVAcceptingStoreInput>): ImportAcceptingStores {
        val variables = ImportAcceptingStores.Variables(
            dryRun = dryRun,
            stores = stores,
        )
        return ImportAcceptingStores(variables)
    }
}
