class QRCodeParseResult {
  final bool hasError;
  final String userErrorMessage;

  QRCodeParseResult({this.hasError = false, this.userErrorMessage = ""});
}

typedef QRCodeContentParser = QRCodeParseResult Function(
    String rawBase64Content);
