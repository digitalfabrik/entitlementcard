import 'package:flutter/material.dart';

class VerificationError {
  final TextSpan errorTextSpan;
  final String errorCode;

  VerificationError(this.errorTextSpan, this.errorCode);
  VerificationError.fromStrings(String errorText, this.errorCode)
      : errorTextSpan = TextSpan(text: errorText);
}
