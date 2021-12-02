import 'dart:math';

import 'package:ehrenamtskarte/widgets/small_button_spinner.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';

import '../../verification/scanner/verification_encoder.dart';
import '../../verification/verification_card_details.dart';
import '../card_details.dart';
import '../card_details_model.dart';
import '../otp_generator.dart';
import 'animated_progressbar.dart';

class VerificationQrCodeView extends StatefulWidget {
  final CardDetails cardDetails;
  final OTPGenerator _otpGenerator;

  VerificationQrCodeView({Key? key, required this.cardDetails})
      : _otpGenerator = OTPGenerator(cardDetails.totpSecretBase32),
        super(key: key);

  @override
  _VerificationQrCodeViewState createState() => _VerificationQrCodeViewState();
}

class _VerificationQrCodeViewState extends State<VerificationQrCodeView> {
  OTPCode? _otpCode;

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
    final otpCode = _otpCode;

    if (otpCode == null) {
      return const SmallButtonSpinner();
    }

    var time = DateTime.now().millisecondsSinceEpoch;
    final animationDuration = otpCode.validUntilMilliSeconds - time;
    return LayoutBuilder(builder: (context, constraints) {
      var padding = min(constraints.maxWidth, constraints.maxHeight) < 400 ? 12.0 : 24.0;
      return Consumer<CardDetailsModel>(builder: (context, cardDetailsModel, child) {
        return ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 600, maxHeight: 600),
            child: Material(
                clipBehavior: Clip.antiAlias,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(padding / 2)),
                child: Stack(children: [
                  Padding(
                      padding: EdgeInsets.all(padding),
                      child: QrImage(
                          data:
                              encodeVerificationCardDetails(VerificationCardDetails(widget.cardDetails, otpCode.code)),
                          version: QrVersions.auto,
                          foregroundColor: Theme.of(context).textTheme.bodyText2?.color,
                          gapless: false)),
                  Positioned.fill(
                      child: AnimatedProgressbar(initialProgress: Duration(milliseconds: animationDuration))),
                ])));
      });
    });
  }
}
