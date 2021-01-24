import 'dart:convert';

import 'package:base32/base32.dart';

import '../card_details.dart';
import '../protobuf/card_activate_model.pb.dart';

class QRCodeParseResult {
  final bool hasError;
  final String internalErrorMessage;
  final String userErrorMessage;

  QRCodeParseResult(
      {this.hasError = false,
      this.internalErrorMessage = "",
      this.userErrorMessage = ""});
}

typedef QRCodeContentParser = QRCodeParseResult Function(
    String rawBase64Content);

CardDetails parseQRCodeContent(String rawContent) {
  final base64Decoder = Base64Decoder();

  final cardActivateModel =
      CardActivateModel.fromBuffer(base64Decoder.convert(rawContent));

  final fullName = cardActivateModel.fullName;
  final randomBytes = cardActivateModel.randomBytes;
  final unixExpirationTime = cardActivateModel.expirationDate.toInt();
  final cardType = cardActivateModel.cardType.toString();
  final regionId = cardActivateModel.region;
  final base32TotpSecret = base32.encode(cardActivateModel.totpSecret);

  final cardDetails = CardDetails(fullName, randomBytes, unixExpirationTime,
      cardType, regionId, base32TotpSecret);

  return cardDetails;
}
