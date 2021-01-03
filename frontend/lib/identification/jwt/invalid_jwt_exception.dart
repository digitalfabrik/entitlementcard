class InvalidJwtException implements Exception {
  String _message;

  InvalidJwtException(String message) {
    this._message = message;
  }

  @override
  String toString() {
    return _message;
  }
}
