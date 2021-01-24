import 'dart:convert';

import 'package:ehrenamtskarte/identification/base_card_details.dart';
import 'package:fixnum/fixnum.dart';

import '../identification/protobuf/card_verify_model.pb.dart';
import 'verification_card_details.dart';

String encodeVerificationCardDetails(
    VerificationCardDetails verificationCardDetails) {
  final cardDetails = verificationCardDetails.cardDetails;

  final cardVerifyModel = CardVerifyModel();

  cardVerifyModel.fullName = cardDetails.fullName;
  cardVerifyModel.randomBytes = List<int>.from(cardDetails.randomBytes);
  cardVerifyModel.expirationDate = Int64(cardDetails.unixExpirationDate);
  switch (cardDetails.cardType) {
    case "STANDARD":
      cardVerifyModel.cardType = CardVerifyModel_CardType.STANDARD;
      break;
    case "GOLD":
      cardVerifyModel.cardType = CardVerifyModel_CardType.GOLD;
      break;
    default:
      cardVerifyModel.cardType = CardVerifyModel_CardType.STANDARD;
      break;
  }
  cardVerifyModel.region = cardDetails.regionId;
  cardVerifyModel.otp = verificationCardDetails.otp;
  final base64Encoder = Base64Encoder();

  final encodedResult = base64Encoder.convert(cardVerifyModel.writeToBuffer());
  print(encodedResult);

  return encodedResult;
}

VerificationCardDetails decodeVerificationCardDetails(String base64Data) {
  final base64Decoder = Base64Decoder();

  final cardVerifyModel =
      CardVerifyModel.fromBuffer(base64Decoder.convert(base64Data));

  final fullName = cardVerifyModel.fullName;
  final randomBytes = cardVerifyModel.randomBytes;
  final unixExpirationTime = cardVerifyModel.expirationDate.toInt();
  final cardType = cardVerifyModel.cardType.toString();
  final regionId = cardVerifyModel.region;
  final otp = cardVerifyModel.otp;

  return VerificationCardDetails(
      BaseCardDetails(
          fullName, randomBytes, unixExpirationTime, cardType, regionId),
      otp);
}
