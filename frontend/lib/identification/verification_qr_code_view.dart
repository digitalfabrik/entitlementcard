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

  VerificationQrCodeView({Key key, this.cardDetails})
      : _otpGenerator = OTPGenerator(cardDetails.base32TotpSecret,
            otpResetIntervalSeconds, 10, Algorithm.SHA256),
        super(key: key);

  @override
  _VerificationQrCodeViewState createState() => _VerificationQrCodeViewState();
}

class _VerificationQrCodeViewState extends State<VerificationQrCodeView> {
  OTPCode _otpCode;

  @override
  void initState() {
    super.initState();
    _otpCode = widget._otpGenerator.generateOTP();
  }

  _resetQrCode() {
    setState(() {
      _otpCode = widget._otpGenerator.generateOTP();
    });
  }

  @override
  Widget build(BuildContext context) {
    final animationDuration = _otpCode.validUntilSeconds * 1000 -
        DateTime.now().millisecondsSinceEpoch;
    return Consumer<CardDetailsModel>(
        builder: (context, cardDetailsModel, child) {
      return Dialog(
          insetPadding: EdgeInsets.all(16),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
          //this right here
          child: Padding(
              padding: EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  AnimatedProgressbar(
                    key: UniqueKey(),
                    duration: animationDuration,
                    onCompleted: _resetQrCode,
                  ),
                  SizedBox(
                    height: 8,
                  ),
                  QrImage(
                      key: UniqueKey(),
                      data: encodeVerificationCardDetails(
                          VerificationCardDetails(
                              widget.cardDetails, _otpCode.code)),
                      version: QrVersions.auto,
                      padding: const EdgeInsets.all(0.0))
                ],
              )));
    });
  }
}
