final _httpRegex = RegExp('^https?://');

String sanitizePhoneNumber(String telephone) => telephone
    .trim() // remove outer whitespace
    .replaceAll(RegExp(r'\s+'), '-') // replace inner whitespace
    .replaceAll(RegExp(r'[^\d+-]'), ''); // remove illegal characters

String prepareWebsiteUrlForDisplay(String website) => website.trim().replaceAll(_httpRegex, '');

String prepareWebsiteUrlForLaunch(String website) {
  final trimmed = website.trim();
  if (_httpRegex.hasMatch(trimmed)) {
    return trimmed;
  } else {
    return 'http://$trimmed';
  }
}
