class InvalidJwtException implements Exception {
  String _message;

  InvalidJwtException(String message) {
    _message = message;
  }

  @override
  String toString() {
    return _message;
  }
}
