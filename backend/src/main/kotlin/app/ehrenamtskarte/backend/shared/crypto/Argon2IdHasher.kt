package app.ehrenamtskarte.backend.shared.crypto

import app.ehrenamtskarte.backend.graphql.cards.CanonicalJson
import app.ehrenamtskarte.backend.graphql.cards.KoblenzUser
import app.ehrenamtskarte.backend.graphql.shared.KOBLENZ_PEPPER_SYS_ENV
import app.ehrenamtskarte.backend.shared.utils.Environment
import org.bouncycastle.crypto.generators.Argon2BytesGenerator
import org.bouncycastle.crypto.params.Argon2Parameters
import java.nio.charset.StandardCharsets
import java.util.Base64

class Argon2IdHasher {
    companion object {
        private const val DEFAULT_ALGORITHM_TYPE = "argon2id"
        private const val DEFAULT_VERSION = 19
        private const val DEFAULT_MEMORY = 19456
        private const val DEFAULT_ITERATIONS = 2
        private const val DEFAULT_PARALLELISM = 1

        /**
         * Copied from spring-security Argon2EncodingUtils.java licenced under Apache 2.0, removed the salt from the result
         *
         * Encodes a raw Argon2-hash and its parameters into the standard Argon2-hash-string
         * as specified in the reference implementation
         * (https://github.com/P-H-C/phc-winner-argon2/blob/master/src/encoding.c#L244):
         *
         * {@code $argon2<T>[$v=<num>]$m=<num>,t=<num>,p=<num>$<bin>}
         **/
        @Throws(IllegalArgumentException::class)
        private fun encodeWithoutSalt(hash: ByteArray?, parameters: Argon2Parameters): String {
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

        fun hashKoblenzUserData(userData: KoblenzUser): String {
            val canonicalJson = CanonicalJson.koblenzUserToString(userData)
            val hashLength = 32

            val pepper = Environment.getVariable(KOBLENZ_PEPPER_SYS_ENV) ?: throw Exception("No koblenz pepper found")
            val pepperByteArray = pepper.toByteArray(StandardCharsets.UTF_8)
            val params =
                Argon2Parameters
                    .Builder(Argon2Parameters.ARGON2_id)
                    .withVersion(DEFAULT_VERSION)
                    .withIterations(DEFAULT_ITERATIONS)
                    .withSalt(pepperByteArray)
                    .withParallelism(DEFAULT_PARALLELISM)
                    .withMemoryAsKB(DEFAULT_MEMORY)
                    .build()

            val generator = Argon2BytesGenerator()
            generator.init(params)
            val result = ByteArray(hashLength)
            generator.generateBytes(canonicalJson.toByteArray(), result)
            return encodeWithoutSalt(result, params)
        }

        fun isValidUserHash(userHash: String): Boolean {
            val parts = userHash.trimStart('$').split("\\$".toRegex())
            if (parts.size != 4) return false

            val (algorithm, version, performance, hash) = parts

            if (algorithm != DEFAULT_ALGORITHM_TYPE) return false
            if (version != "v=$DEFAULT_VERSION") return false
            if (hash.isEmpty()) return false

            val performanceParams = performance.split(",")
            if (performanceParams.size != 3) return false

            val (memory, iterations, parallelism) = performanceParams

            if (memory != "m=$DEFAULT_MEMORY") return false
            if (iterations != "t=$DEFAULT_ITERATIONS") return false
            if (parallelism != "p=$DEFAULT_PARALLELISM") return false

            return true
        }
    }
}
