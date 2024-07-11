
import app.ehrenamtskarte.backend.common.utils.Environment
import app.ehrenamtskarte.backend.common.webservice.KOBLENZ_PEPPER_SYS_ENV
import app.ehrenamtskarte.backend.user.KoblenzUser
import app.ehrenamtskarte.backend.verification.CanonicalJson
import org.bouncycastle.crypto.generators.Argon2BytesGenerator
import org.bouncycastle.crypto.params.Argon2Parameters
import java.nio.charset.StandardCharsets
import java.util.Base64

class Argon2IdHasher {
    companion object {
        /**
         * Copied from spring-security Argon2EncodingUtils.java licenced under Apache 2.0, removed the salt from the result
         *
         * Encodes a raw Argon2-hash and its parameters into the standard Argon2-hash-string
         * as specified in the reference implementation
         * (https://github.com/P-H-C/phc-winner-argon2/blob/master/src/encoding.c#L244):
         *
         * {@code $argon2<T>[$v=<num>]$m=<num>,t=<num>,p=<num>$<bin>$<bin>}
         **/
        @Throws(IllegalArgumentException::class)
        fun encode(
            hash: ByteArray?,
            parameters: Argon2Parameters
        ): String? {
            val b64encoder: Base64.Encoder = Base64.getEncoder().withoutPadding()
            val stringBuilder = StringBuilder()
            val type =
                when (parameters.type) {
                    Argon2Parameters.ARGON2_d -> "\$argon2d"
                    Argon2Parameters.ARGON2_i -> "\$argon2i"
                    Argon2Parameters.ARGON2_id -> "\$argon2id"
                    else -> throw IllegalArgumentException("Invalid algorithm type: " + parameters.type)
                }
            stringBuilder.append(type)
            stringBuilder
                .append("\$v=")
                .append(parameters.version)
                .append("\$m=")
                .append(parameters.memory)
                .append(",t=")
                .append(parameters.iterations)
                .append(",p=")
                .append(parameters.lanes)
            stringBuilder.append("$").append(b64encoder.encodeToString(hash))
            return stringBuilder.toString()
        }

        fun hashKoblenzUserData(userData: KoblenzUser): String? {
            val canonicalJson = CanonicalJson.koblenzUserToString(userData)
            val hashLength = 32

            val pepper = Environment.getVariable(KOBLENZ_PEPPER_SYS_ENV) // TODO handle if Null
            val pepperByteArray = pepper?.toByteArray(StandardCharsets.UTF_8)
            val params =
                Argon2Parameters
                    .Builder(Argon2Parameters.ARGON2_id)
                    .withVersion(19)
                    .withIterations(2)
                    .withSalt(pepperByteArray)
                    .withParallelism(1)
                    .withMemoryAsKB(16)
                    .build()

            val generator = Argon2BytesGenerator()
            generator.init(params)
            val result = ByteArray(hashLength)
            generator.generateBytes(canonicalJson.toByteArray(), result)
            return encode(result, params)
        }
    }
}
