import 'dart:convert';

import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/verification/verification_card_details.dart';

// TODO (Max): Refactor into Dart extension
String encodeVerificationCardDetails(VerificationCardDetails verificationCardDetails) {
  final cardDetails = verificationCardDetails.cardDetails;

  final verifyCode = DynamicVerifyCode(
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
    pepper: cardDetails.pepper,
    otp: verificationCardDetails.otp,
  );

  return const Base64Encoder().convert(QrCode(dynamicVerify: verifyCode).writeToBuffer());
}
