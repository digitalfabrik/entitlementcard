import 'dart:convert';

import 'package:ehrenamtskarte/identification/base_card_details.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/verification/verification_card_details.dart';

// TODO (Max): Refactor into Dart extension
String encodeVerificationCardDetails(VerificationCardDetails verificationCardDetails) {
  final cardDetails = verificationCardDetails.cardDetails;

  final verifyCode = CardVerifyCode(
    info: CardInfo(
      fullName: cardDetails.fullName,
      expirationDay: cardDetails.expirationDay,
      extensions: CardExtensions(
        extensionRegion: RegionExtension(regionId: cardDetails.regionId),
        extensionBavariaCardType: BavariaCardTypeExtension(
          cardType: BavariaCardType.valueOf(cardDetails.cardType.index),
        ),
      ),
    ),
    hashSecret: const Base64Decoder().convert(cardDetails.hashSecretBase64),
    otp: verificationCardDetails.otp,
  );

  return const Base64Encoder().convert(verifyCode.writeToBuffer());
}

// TODO (Max): Refactor into Dart extension
VerificationCardDetails decodeVerificationCardDetails(String base64Data) {
  const base64Decoder = Base64Decoder();

  final verifyCode = CardVerifyCode.fromBuffer(base64Decoder.convert(base64Data));
  final cardInfo = verifyCode.info;

  final fullName = cardInfo.fullName;
  final randomBytes = const Base64Encoder().convert(verifyCode.hashSecret);
  final expirationDay = cardInfo.expirationDay;
  final cardType = CardType.values[cardInfo.extensions.extensionBavariaCardType.cardType.value];
  final regionId = cardInfo.extensions.extensionRegion.regionId;
  final otp = verifyCode.otp;

  return VerificationCardDetails(BaseCardDetails(fullName, randomBytes, expirationDay, cardType, regionId), otp);
}
