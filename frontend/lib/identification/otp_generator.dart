import 'package:otp/otp.dart';

class OTPGenerator {
  final String _base32TotpSecret;
  final int _otpIntervalSeconds;
  final int _otpLength;
  final Algorithm _algorithm;

  OTPGenerator(this._base32TotpSecret, this._otpIntervalSeconds,
      this._otpLength, this._algorithm);

  int generateOTP() {
    return int.parse(OTP.generateTOTPCodeString(
        _base32TotpSecret, DateTime.now().millisecondsSinceEpoch,
        algorithm: _algorithm,
        length: _otpLength,
        interval: _otpIntervalSeconds));
  }
}
