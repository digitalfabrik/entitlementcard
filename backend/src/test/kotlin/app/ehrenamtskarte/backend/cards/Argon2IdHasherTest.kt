package app.ehrenamtskarte.backend.cards
import app.ehrenamtskarte.backend.shared.utils.Environment
import app.ehrenamtskarte.backend.graphql.shared.KOBLENZ_PEPPER_SYS_ENV
import app.ehrenamtskarte.backend.graphql.cards.KoblenzUser
import io.mockk.every
import io.mockk.mockkObject
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource
import kotlin.test.assertEquals

internal class Argon2IdHasherTest {
    @Test
    fun isHashingCorrectly() {
        mockkObject(Environment)
        every { Environment.getVariable(KOBLENZ_PEPPER_SYS_ENV) } returns "123456789ABC"

        assertEquals(Environment.getVariable("KOBLENZ_PEPPER"), "123456789ABC")

        val hash = Argon2IdHasher.hashKoblenzUserData(KoblenzUser(12213, "123K"))
        // This expected output was created with https://argon2.online/
        val expectedHash = "\$argon2id\$v=19\$m=19456,t=2,p=1\$cr3lP9IMUKNz4BLfPGlAOHq1z98G5/2tTbhDIko35tY"
        assertEquals(expectedHash, hash)
    }

    @ParameterizedTest
    @CsvSource(
        "true, \'\$argon2id\$v=19\$m=19456,t=2,p=1\$57YPIKvU/XE9h7/JA0tZFT2TzpwBQfYAW6K+ojXBh5w\'",
        "false, \'\$argon2i\$v=19\$m=19456,t=2,p=1\$57YPIKvU/XE9h7/JA0tZFT2TzpwBQfYAW6K+ojXBh5w\'",
        "false, \'\$argon2id\$v=18\$m=19456,t=2,p=1\$57YPIKvU/XE9h7/JA0tZFT2TzpwBQfYAW6K+ojXBh5w\'",
        "false, \'\$argon2id\$v=19\$m=500,t=2,p=1\$57YPIKvU/XE9h7/JA0tZFT2TzpwBQfYAW6K+ojXBh5w\'",
        "false, \'\$argon2id\$v=19\$m=19456,t=1,p=1\$57YPIKvU/XE9h7/JA0tZFT2TzpwBQfYAW6K+ojXBh5w\'",
        "false, \'\$argon2id\$v=19\$m=19456,t=2,p=2\$57YPIKvU/XE9h7/JA0tZFT2TzpwBQfYAW6K+ojXBh5w\'",
        "false, \'\$argon2id\$v=19\$m=19456,t=2,p=1\'",
        "false, \'\$argon2id\$v=19\$m=19456,t=2,p=1\$\'",
        "false, \'\$v=19\$m=19456,t=2,p=1\$57YPIKvU/XE9h7/JA0tZFT2TzpwBQfYAW6K+ojXBh5w\'",
        "false, \'\$argon2id\$m=19456,t=2,p=1\$57YPIKvU/XE9h7/JA0tZFT2TzpwBQfYAW6K+ojXBh5w\'",
        "false, \'\$argon2id\$v=19\$t=2,p=1\$57YPIKvU/XE9h7/JA0tZFT2TzpwBQfYAW6K+ojXBh5w\'",
        "false, \'\$argon2id\$m=19456,t=2,p=1\$v=19\$57YPIKvU/XE9h7/JA0tZFT2TzpwBQfYAW6K+ojXBh5w\'",
    )
    fun testUserHashValidation(isValid: Boolean, userHash: String) {
        assertEquals(isValid, Argon2IdHasher.isValidUserHash(userHash))
    }
}
