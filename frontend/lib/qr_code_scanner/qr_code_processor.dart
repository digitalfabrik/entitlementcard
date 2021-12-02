class QrCodeParseException implements Exception {
  final String reason;
  QrCodeParseException(this.reason);
  @override
  String toString() => "${runtimeType.toString()}: $reason";
}

class QrCodeFieldMissingException extends QrCodeParseException {
  final String missingFieldName;
  QrCodeFieldMissingException(this.missingFieldName) : super("field missing: $missingFieldName");
}

typedef QRCodeProcessor = void Function(String rawBase64Content);
