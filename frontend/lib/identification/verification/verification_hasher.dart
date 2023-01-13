import 'dart:convert';
import 'dart:typed_data';
import 'package:crypto/crypto.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';

String hashVerifyCode(DynamicVerifyCode verifyCode) {
  final hasher = Hmac(sha256, verifyCode.pepper);
  final byteList = cardDetailsToBinary(verifyCode.info);
  final result = hasher.convert(byteList);
  return const Base64Encoder().convert(result.bytes);
}

List<int> cardDetailsToBinary(CardInfo cardInfo) {
  final buffer = Uint8List(12).buffer;
  final data = ByteData.view(buffer);
  var offset = 0;

  final expirationDay = cardInfo.expirationDay;
  data.setUint32(offset, expirationDay, Endian.little);
  offset += 4;
  data.setInt32(offset, cardInfo.extensions.extensionBavariaCardType.cardType.value, Endian.little);
  offset += 4;
  data.setInt32(offset, cardInfo.extensions.extensionRegion.regionId, Endian.little);
  offset += 4;

  final fullNameBytes = utf8.encode(cardInfo.fullName);

  return buffer.asUint8List() + fullNameBytes + [0];
}
