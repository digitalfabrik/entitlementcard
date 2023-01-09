import 'dart:convert';
import 'dart:typed_data';

import 'package:crypto/crypto.dart';

import 'package:ehrenamtskarte/identification/base_card_details.dart';
import 'package:ehrenamtskarte/verification/verification_card_details.dart';

String hashVerificationCardDetails(VerificationCardDetails verificationCardDetails) {
  final hasher = Hmac(sha256, const Base64Decoder().convert(verificationCardDetails.cardDetails.hashSecretBase64));

  final byteList = cardDetailsToBinary(verificationCardDetails.cardDetails);
  final result = hasher.convert(byteList);
  return const Base64Encoder().convert(result.bytes);
}

List<int> cardDetailsToBinary(BaseCardDetails cardDetails) {
  final buffer = Uint8List(12).buffer;
  final data = ByteData.view(buffer);
  var offset = 0;

  final expirationDay = cardDetails.expirationDay;
  data.setUint32(offset, expirationDay ?? 0, Endian.little);
  offset += 4;
  data.setInt32(offset, cardDetails.cardType.index, Endian.little);
  offset += 4;
  data.setInt32(offset, cardDetails.regionId, Endian.little);
  offset += 4;

  final fullNameBytes = utf8.encode(cardDetails.fullName);

  return buffer.asUint8List() + fullNameBytes + [0];
}
