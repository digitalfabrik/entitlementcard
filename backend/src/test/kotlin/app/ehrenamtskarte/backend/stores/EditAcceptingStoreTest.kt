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
import app.ehrenamtskarte.backend.generated.EditAcceptingStore
import app.ehrenamtskarte.backend.generated.inputs.AcceptingStoreInput
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import app.ehrenamtskarte.backend.helper.CSVAcceptanceStoreBuilder
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestData
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

internal class EditAcceptingStoreTest : IntegrationTest() {
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
        val response = postGraphQL(editStoreMutation(store = CSVAcceptanceStoreBuilder.build(), storeId = 1))

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(GraphQLExceptionCode.UNAUTHORIZED, response.toErrorObject().extensions.code)
    }

    @Test
    fun `should return an error when the user is not allowed to import stores`() {
        val response = postGraphQL(
            editStoreMutation(store = CSVAcceptanceStoreBuilder.build(), storeId = 1),
            TestAdministrators.NUERNBERG_PROJECT_ADMIN.getJwtToken(),
        )

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(GraphQLExceptionCode.FORBIDDEN, response.toErrorObject().extensions.code)
    }

    @Test
    fun `should return an error response if no unique region can be found for a project`() {
        val response = postGraphQL(
            editStoreMutation(store = CSVAcceptanceStoreBuilder.build(), storeId = 1),
            TestAdministrators.EAK_PROJECT_STORE_MANAGER.getJwtToken(),
        )

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals("Error REGION_NOT_UNIQUE occurred.", response.toErrorObject().message)
    }

    @Test
    fun `should return an error response if the store does not exist`() {
        val response = postGraphQL(
            editStoreMutation(store = CSVAcceptanceStoreBuilder.build(), storeId = 999),
            TestAdministrators.NUERNBERG_PROJECT_STORE_MANAGER.getJwtToken(),
        )

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals("Error STORE_NOT_FOUND occurred.", response.toErrorObject().message)
    }

    @Test
    fun `should return no error if optional fields are removed`() {
        val store = TestData.createAcceptingStore()

        val response = postGraphQL(
            editStoreMutation(
                store = CSVAcceptanceStoreBuilder.build(
                    email = "",
                    telephone = "",
                    homepage = "",
                    discountEN = "",
                    discountDE = "",
                ),
                storeId = store.id.value,
            ),
            projectStoreManager.getJwtToken(),
        )

        assertEquals(HttpStatus.OK, response.statusCode)
        val data = response.json()
        assertEquals(true, data.findValue("result").asBoolean())

        transaction {
            val contact = ContactEntity.all().single()
            assertEquals(null, contact.email)
            assertEquals(null, contact.telephone)
            assertEquals(null, contact.website)

            val descriptions = AcceptingStoreDescriptionEntity.all()
            assertEquals(0, descriptions.count())
        }
    }

    @Test
    fun `should return a successful response if one accepting store has been edited`() {
        val store = TestData.createAcceptingStore()
        val response = postGraphQL(
            editStoreMutation(
                store = CSVAcceptanceStoreBuilder.build(
                    name = "Store with new name",
                    categoryId = 12,
                    discountEN = "50% discount",
                    discountDE = "50% Ermäßigung",
                    email = "newManager@test.de",
                    telephone = "0911/654321",
                    homepage = "https://www.tuerantuer.de",
                    street = "Teststr.",
                    houseNumber = "22a",
                    postalCode = "90409",
                    location = "NBG",
                    latitude = 49.4578,
                    longitude = 11.0759,
                ),
                storeId = store.id.value,
            ),
            projectStoreManager.getJwtToken(),
        )

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(true, response.json().findValue("result").asBoolean())

        transaction {
            val acceptanceStore = AcceptingStoreEntity.all().single()

            assertEquals("Store with new name", acceptanceStore.name)
            assertEquals(12, acceptanceStore.categoryId.value)
            assertEquals(95, acceptanceStore.regionId?.value)
            assertNotNull(acceptanceStore.createdDate)

            val descriptions = AcceptingStoreDescriptionEntity.all().associate { it.language to it.description }

            assertEquals(2, descriptions.size)
            assertEquals("50% Ermäßigung", descriptions[LanguageCode.DE])
            assertEquals("50% discount", descriptions[LanguageCode.EN])

            val contact = ContactEntity.all().single()

            assertEquals(acceptanceStore.contactId, contact.id)
            assertEquals("newManager@test.de", contact.email)
            assertEquals("0911/654321", contact.telephone)
            assertEquals("https://www.tuerantuer.de", contact.website)

            val address = AddressEntity.all().single()

            assertEquals("Teststr. 22a", address.street)
            assertEquals("90409", address.postalCode)
            assertEquals("NBG", address.location)
            assertEquals("de", address.countryCode)

            val physicalStore = PhysicalStoreEntity.all().single()

            assertEquals("(11.0759 49.4578)", physicalStore.coordinates.value)
            assertEquals(address.id, physicalStore.addressId)
            assertEquals(acceptanceStore.id, physicalStore.storeId)
        }
    }

    @ParameterizedTest
    @MethodSource("app.ehrenamtskarte.backend.util.AcceptingStoreTestHelper#validationErrorTestCases")
    fun `should return validation error when the csv store input is not valid`(
        testCase: AcceptingStoreTestHelper.AcceptingStoreValidationErrorTestCase,
    ) {
        val store = TestData.createAcceptingStore()
        val response = postGraphQL(
            editStoreMutation(store = testCase.csvStore, storeId = store.id.value),
            projectStoreManager.getJwtToken(),
        )

        assertEquals(HttpStatus.OK, response.statusCode)
        val error = response.toErrorObject()
        assertEquals(GraphQLExceptionCode.INVALID_JSON, error.extensions.code)
        assertEquals(testCase.error, error.message)
    }

    private fun editStoreMutation(store: AcceptingStoreInput, storeId: Int): EditAcceptingStore =
        EditAcceptingStore(
            EditAcceptingStore.Variables(
                store = store,
                storeId = storeId,
            ),
        )
}
