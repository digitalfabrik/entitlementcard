class QrCodeParseException implements Exception {
  final String reason;
  QrCodeParseException(this.reason);
  @override
  String toString() => "QrCodeParseException: $reason";
}

class QrCodeFieldMissingException extends QrCodeParseException {
  final String missingFieldName;
  QrCodeFieldMissingException(this.missingFieldName) : super("field missing: $missingFieldName");
}

class QrCodeWrongTypeException extends QrCodeParseException {
  QrCodeWrongTypeException() : super("Wrong QrCode type was read.");
}


typedef QRCodeProcessor = void Function(String rawBase64Content);
