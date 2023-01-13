import 'dart:convert';
import 'dart:math';
import 'package:ehrenamtskarte/identification/activation_code_model.dart';
import 'package:ehrenamtskarte/identification/card_detail_view/animated_progressbar.dart';
import 'package:ehrenamtskarte/identification/otp_generator.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/widgets/small_button_spinner.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart' show QrImage, QrVersions;

class VerificationCodeView extends StatefulWidget {
  final DynamicActivationCode activationCode;
  final OTPGenerator _otpGenerator;

  VerificationCodeView({super.key, required this.activationCode})
      : _otpGenerator = OTPGenerator(activationCode.totpSecret);

  @override
  _VerificationCodeViewState createState() => _VerificationCodeViewState();
}

class _VerificationCodeViewState extends State<VerificationCodeView> {
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
    final activationCode = widget.activationCode;

    if (otpCode == null) {
      return const SmallButtonSpinner();
    }

    final time = DateTime.now().millisecondsSinceEpoch;
    final animationDuration = otpCode.validUntilMilliSeconds - time;
    return LayoutBuilder(
      builder: (context, constraints) {
        final padding = min(constraints.maxWidth, constraints.maxHeight) < 400 ? 12.0 : 24.0;
        return Consumer<ActivationCodeModel>(
          builder: (context, cardDetailsModel, child) {
            return ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 600, maxHeight: 600),
              child: Material(
                clipBehavior: Clip.antiAlias,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(padding / 2)),
                child: Stack(
                  children: [
                    Padding(
                      padding: EdgeInsets.all(padding),
                      child: QrImage(
                        data: const Base64Encoder().convert(
                          QrCode(
                            dynamicVerifyCode: DynamicVerifyCode(
                              info: activationCode.info,
                              pepper: activationCode.pepper,
                              otp: otpCode.code,
                            ),
                          ).writeToBuffer(),
                        ),
                        version: QrVersions.auto,
                        foregroundColor: Theme.of(context).textTheme.bodyText2?.color,
                        gapless: false,
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
