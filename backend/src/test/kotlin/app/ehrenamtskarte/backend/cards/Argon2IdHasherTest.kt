package app.ehrenamtskarte.backend.verification
import Argon2IdHasher
import app.ehrenamtskarte.backend.common.utils.Environment
import app.ehrenamtskarte.backend.common.webservice.KOBLENZ_PEPPER_SYS_ENV
import app.ehrenamtskarte.backend.userdata.KoblenzUser
import io.mockk.every
import io.mockk.mockkObject
import kotlin.test.Test
import kotlin.test.assertEquals

internal class Argon2IdHasherTest {
    @Test
    fun isHashingCorrectly() {
        mockkObject(Environment)
        every { Environment.getVariable(KOBLENZ_PEPPER_SYS_ENV) } returns "123456789ABC"

        assertEquals(Environment.getVariable("KOBLENZ_PEPPER"), "123456789ABC")

        val hash = Argon2IdHasher.hashKoblenzUserData(KoblenzUser("Karla Koblenz", 12213, "123K"))
        val expectedHash = "\$argon2id\$v=19\$m=19456,t=2,p=1\$57YPIKvU/XE9h7/JA0tZFT2TzpwBQfYAW6K+ojXBh5w" // This expected output was created with https://argon2.online/
        assertEquals(expectedHash, hash)
    }
}
