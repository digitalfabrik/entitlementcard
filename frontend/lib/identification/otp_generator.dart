import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:otp/otp.dart';

class OTPGenerator {
  final String _base32TotpSecret;
  static const int _otpIntervalSeconds = 30;
  static const int _otpLength = 6;
  static const Algorithm _algorithm = Algorithm.SHA256;

  OTPGenerator(this._base32TotpSecret);

  OTPCode generateOTP([VoidCallback onTimeout]) {
    final time = DateTime.now().millisecondsSinceEpoch;
    final intervalMilliSeconds = _otpIntervalSeconds * 1000;
    final validUntilMilliSeconds =
        (time ~/ intervalMilliSeconds + 1) * intervalMilliSeconds;
    if (onTimeout != null) {
      Timer(Duration(milliseconds: validUntilMilliSeconds - time), onTimeout);
    }
    return OTPCode(
        int.parse(OTP.generateTOTPCodeString(
            _base32TotpSecret, time,
            algorithm: _algorithm,
            length: _otpLength,
            interval: _otpIntervalSeconds,
            isGoogle: true)),
        validUntilMilliSeconds);
  }
}

class OTPCode {
  final int code;
  final int validUntilMilliSeconds;

  OTPCode(this.code, this.validUntilMilliSeconds);
}
