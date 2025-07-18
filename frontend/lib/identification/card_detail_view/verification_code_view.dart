import 'dart:async';
import 'dart:math';

import 'package:ehrenamtskarte/identification/card_detail_view/animated_progressbar.dart';
import 'package:ehrenamtskarte/identification/otp_generator.dart';
import 'package:ehrenamtskarte/identification/qr_content_parser.dart';
import 'package:ehrenamtskarte/identification/user_code_model.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart' as qr;

/// Displays the dynamic QR code.
/// Should only be rendered, if we know that the user code is valid (and has been self-verified recently).
class VerificationCodeView extends StatefulWidget {
  final DynamicUserCode userCode;
  final OTPGenerator _otpGenerator;

  VerificationCodeView({super.key, required this.userCode}) : _otpGenerator = OTPGenerator(userCode.totpSecret);

  @override
  VerificationCodeViewState createState() => VerificationCodeViewState();
}

class VerificationCodeViewState extends State<VerificationCodeView> {
  late OTPCode _otpCode;
  Timer? _otpResetTimer;

  @override
  void initState() {
    super.initState();
    _resetQrCode();
  }

  void _resetQrCode() {
    final otpCode = widget._otpGenerator.generateOTP();
    _otpCode = otpCode;
    _otpResetTimer = Timer(
      Duration(milliseconds: otpCode.validUntilMilliSeconds - DateTime.now().millisecondsSinceEpoch),
      () => setState(_resetQrCode),
    );
  }

  @override
  void dispose() {
    _otpResetTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final otpCode = _otpCode;
    final userCode = widget.userCode;
    final colorTheme = Theme.of(context).colorScheme;

    final time = DateTime.now().millisecondsSinceEpoch;
    final animationDuration = otpCode.validUntilMilliSeconds - time;
    return LayoutBuilder(
      builder: (context, constraints) {
        final padding = min(constraints.maxWidth, constraints.maxHeight) < 400 ? 12.0 : 24.0;
        return Consumer<UserCodeModel>(
          builder: (context, cardDetailsModel, child) {
            final qrCode = qr.QrCode.fromUint8List(
              data: createDynamicVerificationQrCodeData(userCode, otpCode.code),
              errorCorrectLevel: qr.QrErrorCorrectLevel.L,
            );

            return ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 600, maxHeight: 600),
              child: Material(
                clipBehavior: Clip.hardEdge,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: Stack(
                  children: [
                    Padding(
                      padding: EdgeInsets.all(padding),
                      child: qr.QrImageView.withQr(
                        qr: qrCode,
                        version: qr.QrVersions.auto,
                        gapless: false,
                        dataModuleStyle: qr.QrDataModuleStyle(
                          dataModuleShape: qr.QrDataModuleShape.square,
                          color: colorTheme.tertiary,
                        ),
                        eyeStyle: qr.QrEyeStyle(eyeShape: qr.QrEyeShape.square, color: colorTheme.tertiary),
                      ),
                    ),
                    Positioned.fill(
                      child: AnimatedProgressbar(initialProgress: Duration(milliseconds: animationDuration)),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}
