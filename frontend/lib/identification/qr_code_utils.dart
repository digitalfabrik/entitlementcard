import 'dart:collection';
import 'dart:convert';
import 'dart:typed_data';
import 'package:crypto/crypto.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:protobuf/protobuf.dart';

class QrCodeUtils {
  const QrCodeUtils();

  String createDynamicVerifyQrCodeData(DynamicActivationCode activationCode, int otpCode) {
    return const Base64Encoder().convert(
      QrCode(
        dynamicVerifyCode: DynamicVerifyCode(
          info: activationCode.info,
          pepper: activationCode.pepper,
          otp: otpCode,
        ),
      ).writeToBuffer(),
    );
  }

  String hashCardInfo(CardInfo cardInfo, List<int> pepper) {
    final hasher = Hmac(sha256, pepper);
    final byteList = _cardInfoToBinary(cardInfo);
    final result = hasher.convert(byteList);
    return const Base64Encoder().convert(result.bytes);
  }

  List<int> _cardInfoToBinary(CardInfo cardInfo) {
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

  Map<String, dynamic> pbMessageToJson(GeneratedMessage message) {

    if (message.unknownFields.isNotEmpty) throw ArgumentError("Unknown field");
    final map = HashMap<String, dynamic>();
    for (final field in message.info_.fieldInfo.values) {
      if (field.isRepeated) {
        throw ArgumentError("Repeated fields are currently not supported.");
      } else if (field.isMapField) {
        throw ArgumentError("Map fields are currently not supported.");
      }

      final dynamic value = message.getFieldOrNull(field.tagNumber);
      if (value == null) {
        continue;
      } else if (value is String) {
        map[field.tagNumber.toString()] = value;
      } else if (value is int) {
        map[field.tagNumber.toString()] = value.toString();
      } else if (value is ProtobufEnum) {
        map[field.tagNumber.toString()] = value.value.toString();
      } else if (value is GeneratedMessage) {
        map[field.tagNumber.toString()] = pbMessageToJson(value);
      } else {
        throw ArgumentError("Could not detect type of field.");
      }
    }
    return map;
  }
}
