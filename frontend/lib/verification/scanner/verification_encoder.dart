import 'dart:convert';

import 'package:fixnum/fixnum.dart';

import '../../identification/base_card_details.dart';
import '../../identification/protobuf/card_verify_model.pb.dart';
import '../verification_card_details.dart';

String encodeVerificationCardDetails(
    VerificationCardDetails verificationCardDetails) {
  final cardDetails = verificationCardDetails.cardDetails;

  CardVerifyModel_CardType cardType;

  switch (cardDetails.cardType) {
    case "STANDARD":
      cardType = CardVerifyModel_CardType.STANDARD;
      break;
    case "GOLD":
      cardType = CardVerifyModel_CardType.GOLD;
      break;
    default:
      throw Exception(
          "The provided card type ${cardDetails.cardType} is unknown!");
  }

  final cardVerifyModel = CardVerifyModel(
    fullName: cardDetails.fullName,
    expirationDate: Int64(cardDetails.unixExpirationDate),
    cardType: cardType,
    regionId: cardDetails.regionId,
    hashSecret: Base64Decoder().convert(cardDetails.hashSecretBase64),
    otp: verificationCardDetails.otp,
  );

  return Base64Encoder().convert(cardVerifyModel.writeToBuffer());
}

VerificationCardDetails decodeVerificationCardDetails(String base64Data) {
  final base64Decoder = Base64Decoder();

  final cardVerifyModel =
      CardVerifyModel.fromBuffer(base64Decoder.convert(base64Data));

  final fullName = cardVerifyModel.fullName;
  final randomBytes = Base64Encoder().convert(cardVerifyModel.hashSecret);
  final unixExpirationTime = cardVerifyModel.expirationDate.toInt();
  final cardType = cardVerifyModel.cardType.toString();
  final regionId = cardVerifyModel.regionId;
  final otp = cardVerifyModel.otp;

  return VerificationCardDetails(
      BaseCardDetails(
          fullName, randomBytes, unixExpirationTime, cardType, regionId),
      otp);
}
