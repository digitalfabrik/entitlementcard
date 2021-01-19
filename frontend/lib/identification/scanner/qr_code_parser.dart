import 'dart:convert';

import '../card_details.dart';
import '../protobuf/card_activate_model.pb.dart';

CardDetails parseQRCodeContent(String rawContent) {
  final decoder = Base64Decoder();

  var cardActivateModel =
      CardActivateModel.fromBuffer(decoder.convert(rawContent));

  var firstName = cardActivateModel.fullName;
  var lastName = "leer";

  if (firstName == null || lastName == null) {
    throw Exception("Name konnte nicht aus QR Code gelesen werden.");
  }

  final expirationDate = DateTime.fromMillisecondsSinceEpoch(
      cardActivateModel.expirationDate.toInt() * 1000);
  var region = "";

  return CardDetails(firstName, lastName, expirationDate, region);
}
