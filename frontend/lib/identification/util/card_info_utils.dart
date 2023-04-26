import 'dart:convert';

import 'package:crypto/crypto.dart';
import 'package:ehrenamtskarte/identification/util/canonical_json.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/util/date_utils.dart';
import 'package:ehrenamtskarte/util/json_canonicalizer.dart';

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
  final expirationDay = cardInfo.hasExpirationDay() ? cardInfo.expirationDay : null;
  // Add 24 hours to be valid on the expiration day and 12h to cover UTC+12
  final int toleranceInHours = 36;
  return expirationDay == null
      ? false
      : DateTime.fromMillisecondsSinceEpoch(0, isUtc: true)
          .add(Duration(days: expirationDay, hours: toleranceInHours))
          .isBefore(DateTime.now());
}

bool cardWasVerifiedLately(CardVerification cardVerification) {
  final lastVerificationTimestamp =
      cardVerification.hasVerificationTimeStamp() ? cardVerification.verificationTimeStamp : null;
  return lastVerificationTimestamp == null
      ? false
      : DateTime.now().toUtc().isBefore(DateTime.fromMillisecondsSinceEpoch(0)
          .add(Duration(days: lastVerificationTimestamp, hours: cardValidationExpireHours)));
}
