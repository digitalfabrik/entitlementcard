class QRCodeParseResult {
  final bool hasError;
  final String internalErrorMessage;
  final String userErrorMessage;

  QRCodeParseResult(
      {this.hasError = false,
      this.internalErrorMessage = "",
      this.userErrorMessage = ""});
}

typedef QRCodeContentParser = QRCodeParseResult Function(
    String rawBase64Content);
