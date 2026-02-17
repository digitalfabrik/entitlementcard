package app.ehrenamtskarte.backend.stores

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.db.entities.AcceptingStoreDescriptionEntity
import app.ehrenamtskarte.backend.db.entities.AcceptingStoreDescriptions
import app.ehrenamtskarte.backend.db.entities.AcceptingStoreEntity
import app.ehrenamtskarte.backend.db.entities.AcceptingStores
import app.ehrenamtskarte.backend.db.entities.AddressEntity
import app.ehrenamtskarte.backend.db.entities.Addresses
import app.ehrenamtskarte.backend.db.entities.ContactEntity
import app.ehrenamtskarte.backend.db.entities.Contacts
import app.ehrenamtskarte.backend.db.entities.LanguageCode
import app.ehrenamtskarte.backend.db.entities.PhysicalStoreEntity
import app.ehrenamtskarte.backend.db.entities.PhysicalStores
import app.ehrenamtskarte.backend.generated.ImportAcceptingStores
import app.ehrenamtskarte.backend.generated.inputs.AcceptingStoreInput
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import app.ehrenamtskarte.backend.helper.CSVAcceptanceStoreBuilder
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestData
import app.ehrenamtskarte.backend.helper.json
import app.ehrenamtskarte.backend.helper.toErrorObject
import app.ehrenamtskarte.backend.util.AcceptingStoreTestHelper
import org.jetbrains.exposed.v1.jdbc.deleteAll
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.MethodSource
import org.springframework.http.HttpStatus
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
            AcceptingStoreDescriptions.deleteAll()
            AcceptingStores.deleteAll()
            Contacts.deleteAll()
        }
    }

    @Test
    fun `should return an error when the auth token is missing`() {
        val mutation = createImportMutation(stores = emptyList())
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals(GraphQLExceptionCode.UNAUTHORIZED, error.extensions.code)
    }

    @Test
    fun `should return an error when the user is not allowed to import stores`() {
        val mutation = createImportMutation(stores = emptyList())
        val response = postGraphQL(mutation, projectAdmin.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals(GraphQLExceptionCode.FORBIDDEN, error.extensions.code)
    }

    @Test
    fun `should return an error response if no unique region can be found for a project`() {
        val mutation = createImportMutation(
            stores = listOf(CSVAcceptanceStoreBuilder.build()),
        )
        val response = postGraphQL(mutation, TestAdministrators.EAK_PROJECT_STORE_MANAGER.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Error REGION_NOT_UNIQUE occurred.", error.message)
    }

    @Test
    fun `should return a successful response if the list of accepting stores is empty`() {
        val mutation = createImportMutation(stores = emptyList())
        val response = postGraphQL(mutation, projectStoreManager.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val data = response.json()

        assertEquals(0, data.findValue("storesCreated").asInt())
        assertEquals(0, data.findValue("storesDeleted").asInt())
        assertEquals(0, data.findValue("storesUntouched").asInt())
    }

    @Test
    fun `should return a successful response if one accepting store with all fields has been created`() {
        val mutation = createImportMutation(
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
            assertEquals(17, acceptanceStore.categoryId.value)
            assertEquals(2, acceptanceStore.projectId.value)
            assertEquals(95, acceptanceStore.regionId?.value)
            assertNotNull(acceptanceStore.createdDate)

            val descriptions = AcceptingStoreDescriptionEntity.all().associate { it.language to it.description }

            assertEquals(2, descriptions.size)
            assertEquals("100% Ermäßigung", descriptions[LanguageCode.DE])
            assertEquals("100% discount", descriptions[LanguageCode.EN])

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
        val mutation = createImportMutation(
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
            assertEquals(0, acceptanceStore.descriptions.count())
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
        val mutation = createImportMutation(
            stores = listOf(CSVAcceptanceStoreBuilder.build(), CSVAcceptanceStoreBuilder.build()),
        )
        val response = postGraphQL(mutation, projectStoreManager.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals(GraphQLExceptionCode.INVALID_JSON, error.extensions.code)
        assertEquals("Duplicate store(s) found: Test store Teststr. 10 90408 Nürnberg", error.message)
    }

    @Test
    fun `should return a successful response if one store has been created and another one has been deleted`() {
        TestData.createAcceptingStore()

        val response = postGraphQL(
            createImportMutation(
                stores = listOf(CSVAcceptanceStoreBuilder.build(name = "Test store 2")),
            ),
            projectStoreManager.getJwtToken(),
        )

        assertEquals(HttpStatus.OK, response.statusCode)

        val data = response.json()

        assertEquals(1, data.findValue("storesCreated").asInt())
        assertEquals(1, data.findValue("storesDeleted").asInt())
        assertEquals(0, data.findValue("storesUntouched").asInt())

        transaction {
            assertEquals("Test store 2", AcceptingStores.selectAll().single().let { it[AcceptingStores.name] })
            assertEquals(1, Contacts.selectAll().count())
            assertEquals(1, Addresses.selectAll().count())
            assertEquals(1, PhysicalStores.selectAll().count())
        }
    }

    @Test
    fun `should return a successful response if nothing has changed`() {
        TestData.createAcceptingStore()

        val mutation = createImportMutation(
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

    @ParameterizedTest
    @MethodSource("app.ehrenamtskarte.backend.util.AcceptingStoreTestHelper#validationErrorTestCases")
    fun `should return validation error when the csv store input is not valid`(
        testCase: AcceptingStoreTestHelper.AcceptingStoreValidationErrorTestCase,
    ) {
        val mutation = createImportMutation(
            stores = listOf(testCase.csvStore),
        )
        val response = postGraphQL(mutation, projectStoreManager.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals(GraphQLExceptionCode.INVALID_JSON, error.extensions.code)
        assertEquals(testCase.error, error.message)
    }

    private fun createImportMutation(
        dryRun: Boolean = false,
        stores: List<AcceptingStoreInput>,
    ): ImportAcceptingStores =
        ImportAcceptingStores(
            ImportAcceptingStores.Variables(
                dryRun = dryRun,
                stores = stores,
            ),
        )
}
