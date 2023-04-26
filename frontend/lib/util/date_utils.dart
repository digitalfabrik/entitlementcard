int daysSinceEpoch(DateTime date) {
  return date.difference(DateTime(1970)).inDays;
}

// 7days x 24h + 1day for expiration day and 12h for UTC+12 = 192
int cardValidationExpireHours = 192;
