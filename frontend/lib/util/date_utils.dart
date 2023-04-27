import 'package:fixnum/fixnum.dart';

Int64 secondsSinceEpoch(DateTime date) {
  return Int64(date.difference(DateTime(1970).toUtc()).inSeconds);
}

// 7days x 24h + 1day for expiration day and 12h for UTC+12 = 192h * 3600
int cardValidationExpireSeconds = 691200;
