String sanitizePhoneNumber(String telephone) => telephone
    .trim() // remove outer whitespace
    .replaceAll(RegExp(r"\s+"), "-") // replace inner whitespace
    .replaceAll(RegExp(r'[^\d+-]'), ""); // remove illegal characters
