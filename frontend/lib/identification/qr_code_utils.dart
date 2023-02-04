import 'dart:collection';
import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/util/json_canonicalizer.dart';
import 'package:protobuf/protobuf.dart';

class QrCodeUtils {
  const QrCodeUtils();

  String createDynamicVerificationQrCodeData(DynamicActivationCode activationCode, int otpCode) {
    return const Base64Encoder().convert(
      QrCode(
        dynamicVerificationCode: DynamicVerificationCode(
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
    final json = messageToJsonObject(cardInfo);
    final canonicalizedJsonString = JsonCanonicalizer().canonicalize(json);
    return utf8.encode(canonicalizedJsonString);
  }

  Map<String, dynamic> messageToJsonObject(GeneratedMessage message) {
    if (message.unknownFields.isNotEmpty) throw ArgumentError("Unknown field");
    final map = HashMap<String, dynamic>();
    for (final field in message.info_.fieldInfo.values) {
      if (field.isRepeated) {
        throw ArgumentError("Repeated fields are currently not supported.");
      } else if (field.isMapField) {
        throw ArgumentError("Map fields are currently not supported.");
      }

      // Ideally, we would check that we do not access fields without explicit presence (and throw in this case).
      // This is currently not supported by protobuf.dart (see https://github.com/google/protobuf.dart/issues/801).
      // However, for the Flutter frontend, this is not critical, as we do not generate hashes based on (in this case)
      // faulty protobuf definitions and store them in the DB.

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
        map[field.tagNumber.toString()] = messageToJsonObject(value);
      } else {
        throw ArgumentError("Could not detect type of field.");
      }
    }
    return map;
  }
}
