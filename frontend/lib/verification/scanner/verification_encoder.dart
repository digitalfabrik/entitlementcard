import 'dart:convert';

import 'package:fixnum/fixnum.dart';

import '../../identification/base_card_details.dart';
import '../../identification/protobuf/card_verify_model.pb.dart';
import '../verification_card_details.dart';

String encodeVerificationCardDetails(
    VerificationCardDetails verificationCardDetails) {
  final cardDetails = verificationCardDetails.cardDetails;

  final cardVerifyModel = CardVerifyModel();

  cardVerifyModel.fullName = cardDetails.fullName;
  cardVerifyModel.hashSecret =
      Base64Decoder().convert(cardDetails.hashSecretBase64);
  cardVerifyModel.expirationDate = Int64(cardDetails.unixExpirationDate);
  switch (cardDetails.cardType) {
    case "STANDARD":
      cardVerifyModel.cardType = CardVerifyModel_CardType.STANDARD;
      break;
    case "GOLD":
      cardVerifyModel.cardType = CardVerifyModel_CardType.GOLD;
      break;
    default:
      throw Exception(
          "The provided card type ${cardDetails.cardType} is unknown!");
  }
  cardVerifyModel.regionId = cardDetails.regionId;
  cardVerifyModel.otp = verificationCardDetails.otp;
  final base64Encoder = Base64Encoder();

  final encodedResult = base64Encoder.convert(cardVerifyModel.writeToBuffer());

  return encodedResult;
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
