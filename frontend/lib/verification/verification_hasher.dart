import 'dart:convert';

import 'package:crypto/crypto.dart';

import 'verification_card_details.dart';

String hashVerificationCardDetails(
    VerificationCardDetails verificationCardDetails) {
  final fullNameBytes =
      utf8.encode(verificationCardDetails.cardDetails.fullName);

  // TODO proper hashing like in #219
  final hasher = Hmac(
      sha256,
      Base64Decoder()
          .convert(verificationCardDetails.cardDetails.hashSecretBase64));

  final result = hasher.convert(fullNameBytes);
  return Base64Encoder().convert(result.bytes);
}
