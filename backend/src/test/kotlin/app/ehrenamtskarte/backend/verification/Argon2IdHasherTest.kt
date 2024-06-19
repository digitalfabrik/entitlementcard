package app.ehrenamtskarte.backend.verification
import Argon2IdHasher
import app.ehrenamtskarte.backend.common.utils.Environment
import app.ehrenamtskarte.backend.common.webservice.KOBLENZ_PEPPER_SYS_ENV
import app.ehrenamtskarte.backend.helper.CardInfoTestSample
import app.ehrenamtskarte.backend.helper.ExampleCardInfo
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

        val userData = ExampleCardInfo.get(CardInfoTestSample.KoblenzPass)

        val hash = Argon2IdHasher.hashUserData(userData)
        val expectedHash = "\$argon2id\$v=19\$m=16,t=2,p=1\$MTIzNDU2Nzg5QUJD\$xJd35mCTBZT8u+FCGWCnmOtxWzcDTb1Pnt5DHWDap7Y" // This expected output was created with https://argon2.online/

        assertEquals(expectedHash, hash)
    }
}
