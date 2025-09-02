package app.ehrenamtskarte.backend.helper

import app.ehrenamtskarte.backend.db.entities.ApplicationEntity
import app.ehrenamtskarte.backend.db.entities.ApplicationVerifications
import app.ehrenamtskarte.backend.db.entities.Applications
import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.ApiTokenType
import app.ehrenamtskarte.backend.auth.database.ApiTokens
import app.ehrenamtskarte.backend.auth.database.PasswordCrypto
import app.ehrenamtskarte.backend.cards.database.Cards
import app.ehrenamtskarte.backend.cards.database.CodeType
import app.ehrenamtskarte.backend.stores.database.AcceptingStoreEntity
import app.ehrenamtskarte.backend.stores.database.AcceptingStores
import app.ehrenamtskarte.backend.stores.database.Addresses
import app.ehrenamtskarte.backend.stores.database.Contacts
import app.ehrenamtskarte.backend.stores.database.PhysicalStores
import app.ehrenamtskarte.backend.userdata.database.UserEntitlements
import app.ehrenamtskarte.backend.userdata.database.UserEntitlementsEntity
import net.postgis.jdbc.geometry.Point
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.insertAndGetId
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.Instant
import java.time.LocalDate
import java.time.OffsetDateTime
import java.util.Base64
import kotlin.random.Random

/**
 * Helper object for creating test data in the database
 */
object TestData {
    fun createApplication(
        regionId: Int? = 1,
        status: ApplicationEntity.Status = ApplicationEntity.Status.Pending,
        statusResolvedDate: OffsetDateTime? = null,
        jsonValue: String = """{"name":"application","type":"Array","value":[]""",
    ): Int {
        val accessKey = Base64.getUrlEncoder().encodeToString(Random.nextBytes(20))
        return transaction {
            Applications.insertAndGetId {
                it[Applications.regionId] = regionId ?: 1
                it[Applications.jsonValue] = jsonValue
                it[Applications.accessKey] = accessKey
                it[Applications.status] = status
                it[Applications.statusResolvedDate] = statusResolvedDate
            }.value
        }
    }

    fun createApplicationVerification(applicationId: Int): Int {
        val accessKey = Base64.getUrlEncoder().encodeToString(Random.nextBytes(20))
        return transaction {
            ApplicationVerifications.insertAndGetId {
                it[ApplicationVerifications.applicationId] = applicationId
                it[ApplicationVerifications.contactEmailAddress] = "dummy@test.de"
                it[ApplicationVerifications.contactName] = "dummy"
                it[ApplicationVerifications.organizationName] = "dummy"
                it[ApplicationVerifications.accessKey] = accessKey
            }.value
        }
    }

    fun createApiToken(
        token: String = "dummy",
        creatorId: Int,
        expirationDate: LocalDate = LocalDate.now().plusYears(1),
        type: ApiTokenType,
    ): Int {
        val tokenHash = PasswordCrypto.hashWithSHA256(token.toByteArray())
        val projectId = findAdmin(creatorId).projectId
        return transaction {
            ApiTokens.insertAndGetId {
                it[ApiTokens.tokenHash] = tokenHash
                it[ApiTokens.creatorId] = creatorId
                it[ApiTokens.expirationDate] = expirationDate
                it[ApiTokens.projectId] = projectId
                it[ApiTokens.type] = type
            }.value
        }
    }

    fun createAcceptingStore(
        name: String = "Test store",
        description: String? = "100% Ermäßigung\n\n100% discount",
        street: String = "Teststr. 10",
        postalCode: String = "90408",
        location: String = "Nürnberg",
        coordinates: Point = Point(),
        email: String? = "info@test.de",
        website: String? = "https://www.test.de",
        telephone: String? = "0911/123456",
        projectId: Int = 2,
        categoryId: Int = 17,
        regionId: Int = 95,
    ): AcceptingStoreEntity =
        transaction {
            val addressId = Addresses.insertAndGetId {
                it[Addresses.street] = street
                it[Addresses.postalCode] = postalCode
                it[Addresses.location] = location
                it[Addresses.countryCode] = "de"
            }
            val contactId = Contacts.insertAndGetId {
                it[Contacts.email] = email
                it[Contacts.telephone] = telephone
                it[Contacts.website] = website
            }
            val acceptingStoreRow = AcceptingStores.insert {
                it[AcceptingStores.name] = name
                it[AcceptingStores.description] = description
                it[AcceptingStores.contactId] = contactId
                it[AcceptingStores.categoryId] = categoryId
                it[AcceptingStores.regionId] = regionId
                it[AcceptingStores.projectId] = projectId
            }.resultedValues!!.first()
            val acceptingStoreEntity = AcceptingStoreEntity.wrapRow(acceptingStoreRow)
            PhysicalStores.insert {
                it[PhysicalStores.storeId] = acceptingStoreEntity.id.value
                it[PhysicalStores.addressId] = addressId
                it[PhysicalStores.coordinates] = coordinates
            }
            acceptingStoreEntity
        }

    fun createUserEntitlement(
        userHash: String = "dummy",
        startDate: LocalDate = LocalDate.now().minusDays(1L),
        endDate: LocalDate = LocalDate.now().plusYears(1L),
        revoked: Boolean = false,
        regionId: Int = 96,
    ): Int =
        transaction {
            UserEntitlements.insertAndGetId {
                it[UserEntitlements.userHash] = userHash.toByteArray()
                it[UserEntitlements.startDate] = startDate
                it[UserEntitlements.endDate] = endDate
                it[UserEntitlements.revoked] = revoked
                it[UserEntitlements.regionId] = regionId
            }.value
        }

    fun createDynamicCard(
        cardInfoHash: ByteArray = Random.nextBytes(20),
        activationSecretHash: ByteArray = Random.nextBytes(20),
        totpSecret: ByteArray? = null,
        expirationDay: Long? = null,
        issueDate: Instant = Instant.now(),
        revoked: Boolean = false,
        issuerId: Int? = null,
        firstActivationDate: Instant? = null,
        entitlementId: Int? = null,
        startDay: Long? = null,
    ): Int =
        createCard(
            cardInfoHash,
            activationSecretHash,
            totpSecret,
            expirationDay,
            issueDate,
            revoked,
            issuerId,
            CodeType.DYNAMIC,
            firstActivationDate,
            entitlementId,
            startDay,
        )

    fun createStaticCard(
        cardInfoHash: ByteArray = Random.nextBytes(20),
        expirationDay: Long? = null,
        issueDate: Instant = Instant.now(),
        revoked: Boolean = false,
        issuerId: Int? = null,
        entitlementId: Int? = null,
        startDay: Long? = null,
    ): Int =
        createCard(
            cardInfoHash = cardInfoHash,
            activationSecretHash = null,
            totpSecret = null,
            expirationDay,
            issueDate,
            revoked,
            issuerId,
            CodeType.STATIC,
            firstActivationDate = null,
            entitlementId,
            startDay,
        )

    private fun createCard(
        cardInfoHash: ByteArray,
        activationSecretHash: ByteArray? = null,
        totpSecret: ByteArray? = null,
        expirationDay: Long? = null,
        issueDate: Instant = Instant.now(),
        revoked: Boolean = false,
        issuerId: Int? = null,
        codeType: CodeType,
        firstActivationDate: Instant? = null,
        entitlementId: Int? = null,
        startDay: Long? = null,
    ): Int {
        val regionId = when {
            issuerId != null -> findAdmin(issuerId).regionId
                ?: throw IllegalStateException("Admin $issuerId must have a region to create a card")
            entitlementId != null -> findUserEntitlement(entitlementId).regionId
            else -> throw Exception("Either issuerId or entitlementId must be provided to create a card")
        }
        return transaction {
            Cards.insertAndGetId {
                it[Cards.activationSecretHash] = activationSecretHash
                it[Cards.totpSecret] = totpSecret
                it[Cards.expirationDay] = expirationDay
                it[Cards.issueDate] = issueDate
                it[Cards.revoked] = revoked
                it[Cards.regionId] = regionId
                it[Cards.issuerId] = issuerId
                it[Cards.cardInfoHash] = cardInfoHash
                it[Cards.codeType] = codeType
                it[Cards.firstActivationDate] = firstActivationDate
                it[Cards.entitlementId] = entitlementId
                it[Cards.startDay] = startDay
            }.value
        }
    }

    private fun findAdmin(adminId: Int): AdministratorEntity =
        transaction {
            AdministratorEntity.findById(adminId) ?: throw Exception("Test admin $adminId not found")
        }

    private fun findUserEntitlement(entitlementId: Int): UserEntitlementsEntity =
        transaction {
            UserEntitlementsEntity.findById(entitlementId)
                ?: throw Exception("User entitlement $entitlementId not found")
        }
}
