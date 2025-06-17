import 'dart:convert';
import 'package:clock/clock.dart';
import 'package:crypto/crypto.dart';
import 'package:ehrenamtskarte/identification/util/canonical_json.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/util/date_utils.dart';
import 'package:ehrenamtskarte/util/json_canonicalizer.dart';
import 'package:intl/intl.dart';
import 'package:timezone/timezone.dart';

final currentTimezone = getLocation('Europe/Berlin');

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
  final expirationDay = getExpirationDay(cardInfo);
  if (expirationDay == null) return false;
  final now = TZDateTime.from(clock.now(), currentTimezone);
  return expirationDay.isBefore(TZDateTime(currentTimezone, now.year, now.month, now.day));
}

bool isCardNotYetValid(CardInfo cardInfo) {
  if (!cardInfo.extensions.hasExtensionStartDay()) return false;
  final startDay = dateFromEpochDaysInTimeZone(
    cardInfo.extensions.extensionStartDay.startDay,
    currentTimezone,
  );
  return startDay.isAfter(TZDateTime.from(clock.now(), currentTimezone));
}

bool isCardExtendable(CardInfo cardInfo, CardVerification cardVerification) {
  if (!cardVerification.cardExtendable) return false;

  final expirationDay = getExpirationDay(cardInfo);
  if (expirationDay == null) return false;

  return DateTime.now().isAfter(expirationDay.subtract(Duration(days: 90)));
}

DateTime? getExpirationDay(CardInfo cardInfo) {
  if (!cardInfo.hasExpirationDay()) return null;
  return dateFromEpochDaysInTimeZone(cardInfo.expirationDay, currentTimezone);
}

bool cardWasVerifiedLately(CardVerification cardVerification) {
  final lastVerificationTimestamp =
      cardVerification.hasVerificationTimeStamp() ? cardVerification.verificationTimeStamp : null;
  return lastVerificationTimestamp == null
      ? false
      : DateTime.now().toUtc().isBefore(DateTime.fromMillisecondsSinceEpoch(0)
          .add(Duration(seconds: lastVerificationTimestamp.toInt() + cardValidationExpireSeconds)));
}

String? getFormattedBirthday(CardInfo cardInfo) {
  if (!cardInfo.extensions.hasExtensionBirthday()) return null;
  final birthday = dateFromEpochDaysUtc(cardInfo.extensions.extensionBirthday.birthday);
  return DateFormat('dd.MM.yyyy').format(birthday);
}
