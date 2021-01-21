package xyz.elitese.ehrenamtskarte

import com.beust.klaxon.Klaxon
import com.eatthepath.otp.TimeBasedOneTimePasswordGenerator
import com.expediagroup.graphql.extensions.print
import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.flag
import com.github.ajalt.clikt.parameters.options.option
import com.google.protobuf.ByteString
import org.apache.commons.codec.binary.Base64
import xyz.elitese.ehrenamtskarte.database.Database
import xyz.elitese.ehrenamtskarte.importer.freinet.FreinetDataImporter
import xyz.elitese.ehrenamtskarte.importer.lbe.LbeDataImporter
import xyz.elitese.ehrenamtskarte.webservice.GraphQLHandler
import java.io.File
import java.security.SecureRandom
import javax.crypto.KeyGenerator


class Entry : CliktCommand() {
    private val exportApi by option(help = "Export GraphQL schema. Given ")
    private val importFreinetData by option("--importFreinet").flag()
    private val importLbeData by option("--importLbe").flag()

    override fun run() {
        val exportApi = exportApi
        if (exportApi != null) {
            val schema = GraphQLHandler.graphQLSchema.print()
            val file = File(exportApi)
            file.writeText(schema)
        } else {
            Database.setup()
            if (importFreinetData) {
                println("Importing data from Freinet...")
                FreinetDataImporter.import()
            }
            if (importLbeData) {
                println("Importing data from Lbe")
                LbeDataImporter.import()
            }
            val totp = TimeBasedOneTimePasswordGenerator()
            val keyGenerator = KeyGenerator.getInstance(totp.algorithm)
            keyGenerator.init(160)
            val key = keyGenerator.generateKey()

            val base32 = Base64()

            println(base32.encodeAsString(key.encoded))

            val unixTime = System.currentTimeMillis() / 1000L

            val random = SecureRandom()
            val randomBytes = ByteArray(16) // 128 bits are converted to 16 bytes;
            random.nextBytes(randomBytes)

            val testMessage = CardActivateModelOuterClass.CardActivateModel
                .newBuilder()
                .setFullName("Maximilian Mustermann")
                .setRandomBytes(ByteString.copyFrom(randomBytes))
                .setExpirationDate(unixTime)
                .setTotpSecret(ByteString.copyFrom(key.encoded))
                .setRegion(55)
                .build()

            val base64 = Base64()
            val base64EncodedMessage = base64.encodeAsString(testMessage.toByteArray())
            File("z0_protofbuf_binary").writeBytes(testMessage.toByteArray())
            File("z1_protobuf_b64.txt").writeText(base64EncodedMessage)

            val jsonTestMessage = JsonMessageTest("This is ä very long name which might happen in søme country",
                "A1DSDF", unixTime, base32.encodeAsString(key.encoded), "1",
                55)

            File("z2_rawjson.json").writeText(Klaxon().toJsonString(jsonTestMessage))
            File("z3_rawjson_b64.txt").writeText(base64.encodeAsString(Klaxon().toJsonString(jsonTestMessage).toByteArray()))

            // WebService().start()
        }
    }

}

fun main(argv: Array<String>) = Entry().main(argv)

data class JsonMessageTest(val fullName: String,
                           val randomString: String,
                           val expirationDate: Long,
                           val totpSecret: String,
                           val cardType: String,
                           val region: Int)
