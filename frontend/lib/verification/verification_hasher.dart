import 'dart:convert';
import 'dart:typed_data';

import 'package:crypto/crypto.dart';

import '../identification/card_details.dart';
import 'verification_card_details.dart';

String hashVerificationCardDetails(
    VerificationCardDetails verificationCardDetails) {
  final hasher = Hmac(
      sha256,
      Base64Decoder()
          .convert(verificationCardDetails.cardDetails.hashSecretBase64));

  final byteList = cardDetailsToBinary(verificationCardDetails.cardDetails);
  final result = hasher.convert(byteList);
  return Base64Encoder().convert(result.bytes);
}

List<int> cardDetailsToBinary(CardDetails cardDetails) {
  var buffer = Uint8List(16).buffer;
  var data = ByteData.view(buffer);
  data.setInt64(0, cardDetails.unixExpirationDate, Endian.little);
  data.setInt32(8, cardDetails.cardType, Endian.little);
  data.setInt32(12, cardDetails.regionId, Endian.little);

  final fullNameBytes = utf8.encode(cardDetails.fullName);

  return buffer.asUint8List() + fullNameBytes + [0];
}
