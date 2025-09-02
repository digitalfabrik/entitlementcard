package app.ehrenamtskarte.backend.graphql.cards

import Card
import com.google.zxing.common.BitArray
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel
import com.google.zxing.qrcode.decoder.Mode
import com.google.zxing.qrcode.decoder.Version

// implementation mostly taken from -> https://github.com/zxing-js/library/blob/master/src/core/qrcode/encoder/Encoder.ts
class QRCodeUtil {
    companion object {
        // Level 8 with EC of M gives 152 bytes
        // Level 7 with EC of L gives 154 bytes
        // Level 8 seems appropriate right now.
        val DEFAULT_VERSION = Version.getVersionForNumber(8)

        // From EC L to M we have a double of EC capability: 7% -> 15%
        val DEFAULT_ERROR_CORRECTION = ErrorCorrectionLevel.M
        val DEFAULT_MODE = Mode.BYTE

        private fun willFit(numInputBits: Int, version: Version, ecLevel: ErrorCorrectionLevel?): Boolean {
            // In the following comments, we use numbers of Version 7-H.
            // numBytes = 196
            val numBytes = version.totalCodewords
            // getNumECBytes = 130
            val ecBlocks = version.getECBlocksForLevel(ecLevel)
            val numEcBytes = ecBlocks.totalECCodewords
            // getNumDataBytes = 196 - 130 = 66
            val numDataBytes = numBytes - numEcBytes
            val totalInputBytes = (numInputBits + 7) / 8
            return numDataBytes >= totalInputBytes
        }

        private fun appendModeInfo(mode: Mode, bits: BitArray) {
            bits.appendBits(mode.bits, 4)
        }

        private fun calculateBitsNeeded(content: ByteArray): Int {
            // This will store the header information, like mode and
            // length, as well as "header" segments like an ECI segment.

            // This will store the header information, like mode and
            // length, as well as "header" segments like an ECI segment.
            val headerBits = BitArray()
            appendModeInfo(DEFAULT_MODE, headerBits)

            return headerBits.size + DEFAULT_MODE.getCharacterCountBits(DEFAULT_VERSION) + content.count() * 8
        }

        private fun isContentLengthValid(content: ByteArray): Boolean =
            willFit(calculateBitsNeeded(content), DEFAULT_VERSION, DEFAULT_ERROR_CORRECTION)

        fun isContentLengthValid(card: Card.DynamicActivationCode): Boolean =
            isContentLengthValid(
                Card.QrCode.newBuilder().setDynamicActivationCode(card).build().toByteArray(),
            )

        fun isContentLengthValid(card: Card.StaticVerificationCode): Boolean =
            isContentLengthValid(
                Card.QrCode.newBuilder().setStaticVerificationCode(card).build().toByteArray(),
            )
    }
}
