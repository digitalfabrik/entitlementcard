import 'dart:convert';

import 'package:crypto/crypto.dart';

import 'verification_card_details.dart';

String hashVerificationCardDetails(
    VerificationCardDetails verificationCardDetails) {
  final fullNameBytes =
      utf8.encode(verificationCardDetails.cardDetails.fullName);

  final hasher = Hmac(sha256, verificationCardDetails.cardDetails.randomBytes);

  final result = hasher.convert(fullNameBytes);
  return Base64Encoder().convert(result.bytes);
}
