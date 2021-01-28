import 'package:otp/otp.dart';

class OTPGenerator {
  final String _base32TotpSecret;
  final int _otpIntervalSeconds;
  final int _otpLength;
  final Algorithm _algorithm;

  OTPGenerator(this._base32TotpSecret, this._otpIntervalSeconds,
      this._otpLength, this._algorithm);

  OTPCode generateOTP() {
    final time = DateTime.now().millisecondsSinceEpoch;
    final validUntilSeconds =
        ((((time ~/ 1000).round()) ~/ _otpIntervalSeconds).floor() + 2) *
            _otpIntervalSeconds;
    return OTPCode(
        int.parse(OTP.generateTOTPCodeString(
            _base32TotpSecret, DateTime.now().millisecondsSinceEpoch,
            algorithm: _algorithm,
            length: _otpLength,
            interval: _otpIntervalSeconds)),
        validUntilSeconds);
  }
}

class OTPCode {
  final int code;
  final int validUntilSeconds;

  OTPCode(this.code, this.validUntilSeconds);
}
