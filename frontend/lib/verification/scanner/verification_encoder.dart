import 'dart:convert';

import 'package:fixnum/fixnum.dart';

import '../../identification/base_card_details.dart';
import '../../identification/protobuf/card_verify_model.pb.dart';
import '../verification_card_details.dart';

String encodeVerificationCardDetails(
    VerificationCardDetails verificationCardDetails) {
  final cardDetails = verificationCardDetails.cardDetails;

  final cardVerifyModel = CardVerifyModel(
    fullName: cardDetails.fullName,
    expirationDate: Int64(cardDetails.unixExpirationDate ?? 0),
    cardType: CardVerifyModel_CardType.valueOf(cardDetails.cardType.index),
    regionId: cardDetails.regionId,
    hashSecret: const Base64Decoder().convert(cardDetails.hashSecretBase64),
    otp: verificationCardDetails.otp,
  );

  return const Base64Encoder().convert(cardVerifyModel.writeToBuffer());
}

VerificationCardDetails decodeVerificationCardDetails(String base64Data) {
  const base64Decoder = Base64Decoder();

  final cardVerifyModel =
      CardVerifyModel.fromBuffer(base64Decoder.convert(base64Data));

  final fullName = cardVerifyModel.fullName;
  final randomBytes = const Base64Encoder().convert(cardVerifyModel.hashSecret);
  final unixExpirationTime = cardVerifyModel.expirationDate.toInt();
  final cardType = CardType.values[cardVerifyModel.cardType.value];
  final regionId = cardVerifyModel.regionId;
  final otp = cardVerifyModel.otp;

  return VerificationCardDetails(
      BaseCardDetails(
          fullName, randomBytes, unixExpirationTime, cardType, regionId),
      otp);
}
