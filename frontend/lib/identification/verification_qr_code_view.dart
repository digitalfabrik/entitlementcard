import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:otp/otp.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';

import '../verification/verification_card_details.dart';
import '../verification/verification_encoder.dart';
import 'animated_progressbar.dart';
import 'card_details.dart';
import 'card_details_model.dart';
import 'otp_generator.dart';

class VerificationQrCodeView extends StatefulWidget {
  final CardDetails cardDetails;
  final OTPGenerator _otpGenerator;
  static const otpResetIntervalSeconds = 30;
  static const otpLength = 10;

  VerificationQrCodeView({Key key, this.cardDetails})
      : _otpGenerator = OTPGenerator(cardDetails.base32TotpSecret,
            otpResetIntervalSeconds, otpLength, Algorithm.SHA256),
        super(key: key);

  @override
  _VerificationQrCodeViewState createState() => _VerificationQrCodeViewState();
}

class _VerificationQrCodeViewState extends State<VerificationQrCodeView> {
  OTPCode _otpCode;

  @override
  void initState() {
    super.initState();
    _otpCode = widget._otpGenerator.generateOTP(_resetQrCode);
  }

  _resetQrCode() {
    setState(() {
      _otpCode = widget._otpGenerator.generateOTP(_resetQrCode);
    });
  }

  @override
  Widget build(BuildContext context) {
    final animationDuration =
        _otpCode.validUntilMilliSeconds - DateTime.now().millisecondsSinceEpoch;
    return Consumer<CardDetailsModel>(
        builder: (context, cardDetailsModel, child) {
      return Dialog(
          insetPadding: EdgeInsets.all(16),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
          child: Padding(
              padding: EdgeInsets.all(24),
              child: Stack(
                overflow: Overflow.visible,
                children: [
                  QrImage(
                      key: UniqueKey(),
                      data: encodeVerificationCardDetails(
                          VerificationCardDetails(
                              widget.cardDetails, _otpCode.code)),
                      version: QrVersions.auto,
                      padding: const EdgeInsets.all(0.0)),
                  Positioned(
                      bottom: -12,
                      left: 0,
                      right: 0,
                      child: AnimatedProgressbar(
                        key: UniqueKey(),
                        duration: animationDuration,
                      )),
                ],
              )));
    });
  }
}
