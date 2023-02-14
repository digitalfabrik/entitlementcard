import 'dart:async';

import 'package:base32/base32.dart';
import 'package:flutter/foundation.dart';
import 'package:otp/otp.dart';

class OTPGenerator {
  final String _totpSecretBase32;
  static const int _otpIntervalSeconds = 30;
  static const int _otpLength = 6;
  static const Algorithm _algorithm = Algorithm.SHA256;

  OTPGenerator(List<int> totpSecret) : _totpSecretBase32 = base32.encode(Uint8List.fromList(totpSecret));

  OTPCode generateOTP([VoidCallback? onTimeout]) {
    final time = DateTime.now().millisecondsSinceEpoch;
    const intervalMilliSeconds = _otpIntervalSeconds * 1000;
    final validUntilMilliSeconds = (time ~/ intervalMilliSeconds + 1) * intervalMilliSeconds;
    if (onTimeout != null) {
      Timer(Duration(milliseconds: validUntilMilliSeconds - time), onTimeout);
    }
    return OTPCode(
      int.parse(
        OTP.generateTOTPCodeString(
          _totpSecretBase32,
          time,
          algorithm: _algorithm,
          length: _otpLength,
          interval: _otpIntervalSeconds,
          isGoogle: true,
        ),
      ),
      validUntilMilliSeconds,
    );
  }
}

class OTPCode {
  final int code;
  final int validUntilMilliSeconds;

  OTPCode(this.code, this.validUntilMilliSeconds);
}
