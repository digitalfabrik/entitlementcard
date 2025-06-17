import 'package:fixnum/fixnum.dart';
import 'package:timezone/timezone.dart';

Int64 secondsSinceEpoch(DateTime date) {
  return Int64(date.difference(DateTime.utc(1970)).inSeconds);
}

DateTime dateFromEpochDaysUtc(int epochDays) {
  return DateTime.utc(1970).add(Duration(days: epochDays));
}

DateTime dateFromEpochDaysInTimeZone(int epochDays, Location location) {
  final dateTime = dateFromEpochDaysUtc(epochDays);
  return TZDateTime(location, dateTime.year, dateTime.month, dateTime.day);
}

// 7days x 24h + 1day for expiration day and 12h for UTC+12 = 192h * 3600
int cardValidationExpireSeconds = 691200;
