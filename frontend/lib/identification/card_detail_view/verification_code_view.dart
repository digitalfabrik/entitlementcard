import 'dart:math';

import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/identification/card_detail_view/animated_progressbar.dart';
import 'package:ehrenamtskarte/identification/otp_generator.dart';
import 'package:ehrenamtskarte/identification/qr_content_parser.dart';
import 'package:ehrenamtskarte/identification/user_code_model.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/query_server_verification.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/widgets/small_button_spinner.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart' as qr show QrImage, QrCode, QrVersions, QrErrorCorrectLevel;

class VerificationCodeView extends StatefulWidget {
  final DynamicUserCode userCode;
  final OTPGenerator _otpGenerator;
  final bool isVerificationExpired;

  VerificationCodeView({super.key, required this.userCode, required this.isVerificationExpired})
      : _otpGenerator = OTPGenerator(userCode.totpSecret);

  @override
  VerificationCodeViewState createState() => VerificationCodeViewState();
}

class VerificationCodeViewState extends State<VerificationCodeView> {
  OTPCode? _otpCode;

  @override
  void initState() {
    super.initState();
    _otpCode = widget._otpGenerator.generateOTP(_resetQrCode);
    SchedulerBinding.instance.addPostFrameCallback((_) => verifyCard(_otpCode, widget.userCode, context));
  }

  _resetQrCode() {
    setState(() {
      _otpCode = widget._otpGenerator.generateOTP(_resetQrCode);
    });
  }

  @override
  Widget build(BuildContext context) {
    final otpCode = _otpCode;
    final userCode = widget.userCode;
    final isVerificationExpired = widget.isVerificationExpired;

    if (otpCode == null) {
      return const SmallButtonSpinner();
    }
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
            qrCode.make();

            return isVerificationExpired
                ? IconButton(
                    icon: const Icon(Icons.refresh),
                    color: Theme.of(context).appBarTheme.backgroundColor,
                    onPressed: () {
                      verifyCard(otpCode, userCode, context);
                    },
                  )
                : ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 600, maxHeight: 600),
                    child: Material(
                      clipBehavior: Clip.hardEdge,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      child: Stack(
                        children: [
                          Padding(
                            padding: EdgeInsets.all(padding),
                            child: qr.QrImage.withQr(
                              qr: qrCode,
                              version: qr.QrVersions.auto,
                              foregroundColor: Theme.of(context).textTheme.bodyMedium?.color,
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

  Future<void> verifyCard(OTPCode? otpCode, DynamicUserCode userCode, BuildContext context) async {
    if (otpCode == null) {
      return;
    }
    final projectId = Configuration.of(context).projectId;
    final client = GraphQLProvider.of(context).value;
    final DynamicVerificationCode qrCode = DynamicVerificationCode(
      info: userCode.info,
      pepper: userCode.pepper,
      otp: otpCode.code,
    );
    final cardVerification = await queryDynamicServerVerification(client, projectId, qrCode);
    if (cardVerification.valid) {
      updateLastCardVerification(cardVerification.lastCheck);
    } else {
      removeInvalidCard();
    }
  }

  void updateLastCardVerification(String lastCheck) {
    final settings = Provider.of<SettingsModel>(context, listen: false);
    settings.setLastCardVerification(lastVerification: lastCheck);
  }

  void removeInvalidCard() {
    final card = Provider.of<UserCodeModel>(context, listen: false);
    card.removeCode();
  }
}
