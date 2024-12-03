import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:ehrenamtskarte/identification/util/canonical_json.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/util/date_utils.dart';
import 'package:ehrenamtskarte/util/json_canonicalizer.dart';
import 'package:intl/intl.dart';

extension Hashing on CardInfo {
  String hash(List<int> pepper) {
    final hasher = Hmac(sha256, pepper);
    final byteList = _toBinary();
    final result = hasher.convert(byteList);
    return const Base64Encoder().convert(result.bytes);
  }

  List<int> _toBinary() {
    final json = toCanonicalJsonObject();
    final canonicalizedJsonString = JsonCanonicalizer().canonicalize(json);
    return utf8.encode(canonicalizedJsonString);
  }
}

bool isCardExpired(CardInfo cardInfo) {
  final expirationDay = _getExpirationDayWithTolerance(cardInfo);
  return expirationDay != null && expirationDay.isBefore(DateTime.now());
}

bool isCardExtendable(CardInfo cardInfo, CardVerification cardVerification) {
  if (!cardVerification.cardExtendable) return false;

  final expirationDay = _getExpirationDayWithTolerance(cardInfo);
  if (expirationDay == null) return false;

  return DateTime.now().isAfter(expirationDay.subtract(Duration(days: 90)));
}

bool cardWasVerifiedLately(CardVerification cardVerification) {
  final lastVerificationTimestamp =
      cardVerification.hasVerificationTimeStamp() ? cardVerification.verificationTimeStamp : null;
  return lastVerificationTimestamp == null
      ? false
      : DateTime.now().toUtc().isBefore(DateTime.fromMillisecondsSinceEpoch(0)
          .add(Duration(seconds: lastVerificationTimestamp.toInt() + cardValidationExpireSeconds)));
}

bool isCardNotYetValid(CardInfo cardInfo) {
  final startingDay =
      cardInfo.extensions.hasExtensionStartDay() ? cardInfo.extensions.extensionStartDay.startDay : null;
  return startingDay == null
      ? false
      : DateTime.fromMillisecondsSinceEpoch(0, isUtc: true)
          .add(Duration(days: startingDay))
          .isAfter(DateTime.now().toUtc());
}

DateTime? _getExpirationDayWithTolerance(CardInfo cardInfo) {
  final expirationDay = cardInfo.hasExpirationDay() ? cardInfo.expirationDay : null;
  if (expirationDay == null) return null;

  // Add 24 hours to be valid on the expiration day and 12h to cover UTC+12
  const toleranceInHours = 36;
  return DateTime.fromMillisecondsSinceEpoch(0, isUtc: true)
      .add(Duration(days: expirationDay, hours: toleranceInHours));
}

String? getFormattedBirthday(CardInfo cardInfo) {
  final birthday = cardInfo.extensions.hasExtensionBirthday() ? cardInfo.extensions.extensionBirthday.birthday : null;
  return birthday != null
      ? DateFormat('dd.MM.yyyy').format(DateTime.fromMillisecondsSinceEpoch(0).add(Duration(days: birthday)))
      : null;
}
