package app.ehrenamtskarte.administration.serialization

import net.glxn.qrgen.javase.QRCode

class QRCodeGenerator {

    fun generateQrCode(content: String, width: Int = 400, height: Int = 400): ByteArray {
        val qrCodeStream = QRCode.from(content).withSize(width, height).stream()
        return qrCodeStream.toByteArray()
    }
}