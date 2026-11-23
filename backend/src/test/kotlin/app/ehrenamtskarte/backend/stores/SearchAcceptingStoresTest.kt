package app.ehrenamtskarte.backend.stores

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.db.entities.AcceptingStoreDescriptions
import app.ehrenamtskarte.backend.db.entities.AcceptingStores
import app.ehrenamtskarte.backend.db.entities.Addresses
import app.ehrenamtskarte.backend.db.entities.Contacts
import app.ehrenamtskarte.backend.db.entities.PhysicalStores
import app.ehrenamtskarte.backend.generated.SearchAcceptingStoresInProjectV3
import app.ehrenamtskarte.backend.generated.inputs.SearchParamsInput
import app.ehrenamtskarte.backend.helper.TestData
import app.ehrenamtskarte.backend.helper.json
import org.jetbrains.exposed.v1.jdbc.deleteAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import kotlin.test.assertEquals

internal class SearchAcceptingStoresTest : IntegrationTest() {
    private val project = "nuernberg.sozialpass.app"

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
    fun `should return the total count independent of limit and offset`() {
        repeat(3) { TestData.createAcceptingStore(name = "Store $it") }

        val result = search(SearchParamsInput(limit = 2))

        assertEquals(2, result.findValue("stores").size())
        // Each store has two descriptions, so this also ensures stores are not counted multiple times
        assertEquals(3, result.findValue("totalCount").asInt())
    }

    @Test
    fun `should only count stores matching category and search text`() {
        TestData.createAcceptingStore(name = "Tanzschule", categoryId = 17)
        TestData.createAcceptingStore(name = "Sportverein", categoryId = 17)
        TestData.createAcceptingStore(name = "Tanzcafe", categoryId = 8)

        val result = search(SearchParamsInput(categoryIds = listOf(17), searchText = "tanz"))

        assertEquals(1, result.findValue("totalCount").asInt())
        assertEquals("Tanzschule", result.findValue("stores")[0].findValue("name").asString())
    }

    @Test
    fun `should not count stores of other projects`() {
        TestData.createAcceptingStore()
        TestData.createAcceptingStore(projectId = 1, regionId = 1)

        val result = search(SearchParamsInput())

        assertEquals(1, result.findValue("totalCount").asInt())
    }

    private fun search(params: SearchParamsInput) =
        postGraphQL(
            SearchAcceptingStoresInProjectV3(SearchAcceptingStoresInProjectV3.Variables(project, params)),
        ).let {
            assertEquals(HttpStatus.OK, it.statusCode)
            it.json().findValue("result")
        }
}
