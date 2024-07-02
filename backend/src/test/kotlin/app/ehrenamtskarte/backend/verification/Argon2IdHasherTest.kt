package app.ehrenamtskarte.backend.verification
import Argon2IdHasher
import app.ehrenamtskarte.backend.common.utils.Environment
import app.ehrenamtskarte.backend.common.webservice.KOBLENZ_PEPPER_SYS_ENV
import app.ehrenamtskarte.backend.user.KoblenzUser
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
        val expectedHash = "\$argon2id\$v=19\$m=16,t=2,p=1\$MTIzNDU2Nzg5QUJD\$UIOJZIsSL8vXcuCB82xZ5E8tpH6sQd3d4U0uC02DP40" // This expected output was created with https://argon2.online/

        assertEquals(expectedHash, hash)
    }
}
