import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:otp/otp.dart';

class OTPGenerator {
  final String _base32TotpSecret;
  final int _otpIntervalSeconds;
  final int _otpLength;
  final Algorithm _algorithm;

  OTPGenerator(this._base32TotpSecret, this._otpIntervalSeconds,
      this._otpLength, this._algorithm);

  OTPCode generateOTP([VoidCallback onTimeout]) {
    final time = DateTime.now().millisecondsSinceEpoch;
    final validUntilMilliSeconds =
        ((((time ~/ 1000).round()) ~/ _otpIntervalSeconds).floor() + 1) *
            _otpIntervalSeconds *
            1000;
    if (onTimeout != null) {
      Timer(Duration(milliseconds: validUntilMilliSeconds - time), onTimeout);
    }
    return OTPCode(
        int.parse(OTP.generateTOTPCodeString(
            _base32TotpSecret, DateTime.now().millisecondsSinceEpoch,
            algorithm: _algorithm,
            length: _otpLength,
            interval: _otpIntervalSeconds)),
        validUntilMilliSeconds);
  }
}

class OTPCode {
  final int code;
  final int validUntilMilliSeconds;

  OTPCode(this.code, this.validUntilMilliSeconds);
}
