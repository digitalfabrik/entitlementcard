import 'dart:convert';

import '../card_details.dart';
import '../protobuf/card_activate_model.pb.dart';

CardDetails parseQRCodeContent(String rawContent) {
  final decoder = Base64Decoder();

  var cardActivateModel =
      CardActivateModel.fromBuffer(decoder.convert(rawContent));

  final fullName = cardActivateModel.fullName;

  final unixExpirationTime = cardActivateModel.expirationDate.toInt();

  final cardType = cardActivateModel.cardType.toString();

  final regionId = cardActivateModel.region;

  return CardDetails(fullName, unixExpirationTime, cardType, regionId);
}
