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
import app.ehrenamtskarte.backend.db.entities.PhysicalStoreEntity
import app.ehrenamtskarte.backend.db.entities.PhysicalStores
import app.ehrenamtskarte.backend.generated.DeleteStores
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestData
import app.ehrenamtskarte.backend.helper.json
import app.ehrenamtskarte.backend.helper.toErrorObject
import org.jetbrains.exposed.v1.jdbc.deleteAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import kotlin.test.assertEquals

internal class DeleteAcceptingStoresTest : IntegrationTest() {
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
        val response = postGraphQL(deleteStoreMutation(emptyList()))

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(GraphQLExceptionCode.UNAUTHORIZED, response.toErrorObject().extensions.code)
    }

    @Test
    fun `should return an error when the user is not allowed to delete stores`() {
        val response = postGraphQL(
            deleteStoreMutation(emptyList()),
            TestAdministrators.NUERNBERG_PROJECT_ADMIN.getJwtToken(),
        )

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(GraphQLExceptionCode.FORBIDDEN, response.toErrorObject().extensions.code)
    }

    @Test
    fun `should handle non-existent store ids gracefully`() {
        val response = postGraphQL(deleteStoreMutation(listOf(999)), projectStoreManager.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val result = response.json().findValue("result")
        assertEquals(0, result.size())

        transaction {
            assertEquals(0, AcceptingStoreEntity.all().count())
        }
    }

    @Test
    fun `should return a successful response with deleted storeIds when stores were successfully deleted`() {
        val firstStore = TestData.createAcceptingStore()
        val secondStore = TestData.createAcceptingStore()
        val response = postGraphQL(
            deleteStoreMutation(listOf(firstStore.id.value, secondStore.id.value)),
            projectStoreManager.getJwtToken(),
        )

        assertEquals(HttpStatus.OK, response.statusCode)

        val result = response.json().findValue("result")
        assertEquals(listOf(firstStore.id.value, secondStore.id.value), result.map { it.asInt() })
        transaction {
            assertEquals(0, AcceptingStoreEntity.all().count())
            assertEquals(0, ContactEntity.all().count())
            assertEquals(0, AddressEntity.all().count())
            assertEquals(0, PhysicalStoreEntity.all().count())
            assertEquals(0, AcceptingStoreDescriptionEntity.all().count())
        }
    }

    private fun deleteStoreMutation(storeIds: List<Int>): DeleteStores =
        DeleteStores(
            DeleteStores.Variables(
                storeIds = storeIds,
            ),
        )
}
