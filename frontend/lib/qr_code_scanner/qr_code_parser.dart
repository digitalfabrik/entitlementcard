class QRCodeParseException implements Exception {
  final String reason;
  QRCodeParseException(this.reason);
  String toString() => "${runtimeType.toString()}: $reason";
}

class QRCodeFieldMissingException extends QRCodeParseException {
  String missingFieldName;
  QRCodeFieldMissingException(this.missingFieldName) :
        super("field missing: $missingFieldName");
}

typedef QRCodeContentParser = void Function(String rawBase64Content);
