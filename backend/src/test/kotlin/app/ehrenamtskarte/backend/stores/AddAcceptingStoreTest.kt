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
import app.ehrenamtskarte.backend.generated.AddAcceptingStore
import app.ehrenamtskarte.backend.generated.inputs.AcceptingStoreInput
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import app.ehrenamtskarte.backend.helper.CSVAcceptanceStoreBuilder
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.json
import app.ehrenamtskarte.backend.helper.toErrorObject
import app.ehrenamtskarte.backend.util.AcceptingStoreTestHelper
import org.jetbrains.exposed.v1.jdbc.deleteAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.MethodSource
import org.springframework.http.HttpStatus
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

internal class AddAcceptingStoreTest : IntegrationTest() {
    private val projectStoreManager = TestAdministrators.NUERNBERG_PROJECT_STORE_MANAGER

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
        val response = postGraphQL(addStoreMutation(store = CSVAcceptanceStoreBuilder.build()))

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(GraphQLExceptionCode.UNAUTHORIZED, response.toErrorObject().extensions.code)
    }

    @Test
    fun `should return an error when the user is not allowed to import stores`() {
        val response = postGraphQL(
            addStoreMutation(store = CSVAcceptanceStoreBuilder.build()),
            TestAdministrators.NUERNBERG_PROJECT_ADMIN.getJwtToken(),
        )

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(GraphQLExceptionCode.FORBIDDEN, response.toErrorObject().extensions.code)
    }

    @Test
    fun `should return an error response if no unique region can be found for a project`() {
        val response = postGraphQL(
            addStoreMutation(
                store = CSVAcceptanceStoreBuilder.build(),
            ),
            TestAdministrators.EAK_PROJECT_STORE_MANAGER.getJwtToken(),
        )

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals("Error REGION_NOT_UNIQUE occurred.", response.toErrorObject().message)
    }

    @Test
    fun `should return a successful response if one accepting store with all fields has been created`() {
        val response = postGraphQL(
            addStoreMutation(
                store = CSVAcceptanceStoreBuilder.build(),
            ),
            projectStoreManager.getJwtToken(),
        )

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(true, response.json().findValue("result").asBoolean())

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
        val response = postGraphQL(
            addStoreMutation(
                store =
                    CSVAcceptanceStoreBuilder.build(
                        telephone = "",
                        email = "",
                        homepage = "",
                        discountDE = "",
                        discountEN = "",
                    ),
            ),
            projectStoreManager.getJwtToken(),
        )

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(true, response.json().findValue("result").asBoolean())

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
        val mutation = addStoreMutation(
            store = CSVAcceptanceStoreBuilder.build(),
        )
        postGraphQL(mutation, projectStoreManager.getJwtToken())

        val response = postGraphQL(mutation, projectStoreManager.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals("Error STORE_ALREADY_EXISTS occurred.", response.toErrorObject().message)
    }

    @ParameterizedTest
    @MethodSource("app.ehrenamtskarte.backend.util.AcceptingStoreTestHelper#validationErrorTestCases")
    fun `should return validation error when the csv store input is not valid`(
        testCase: AcceptingStoreTestHelper.AcceptingStoreValidationErrorTestCase,
    ) {
        val mutation = addStoreMutation(store = testCase.csvStore)
        val response = postGraphQL(mutation, projectStoreManager.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        val error = response.toErrorObject()
        assertEquals(GraphQLExceptionCode.INVALID_JSON, error.extensions.code)
        assertEquals(testCase.error, error.message)
    }

    @ParameterizedTest
    @MethodSource("app.ehrenamtskarte.backend.util.AcceptingStoreTestHelper#validationErrorTestCases")
    fun `should return validation error when the csv store input is not valid`(
        testCase: AcceptingStoreTestHelper.AcceptingStoreValidationErrorTestCase,
    ) {
        val mutation = addStoreMutation(store = testCase.csvStore)
        val response = postGraphQL(mutation, projectStoreManager.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        val error = response.toErrorObject()
        assertEquals(GraphQLExceptionCode.INVALID_JSON, error.extensions.code)
        assertEquals(testCase.error, error.message)
    }

    private fun addStoreMutation(store: AcceptingStoreInput): AddAcceptingStore =
        AddAcceptingStore(
            AddAcceptingStore.Variables(
                store = store,
            ),
        )
}
