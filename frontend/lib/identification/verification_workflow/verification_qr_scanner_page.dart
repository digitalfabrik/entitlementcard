import 'dart:convert';

import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/identification/activation_code_model.dart';
import 'package:ehrenamtskarte/identification/otp_generator.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_scanner_page.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/dialogs/internet_connection_verification_dialog.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/dialogs/negative_verification_result_dialog.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/dialogs/positive_verification_result_dialog.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/dialogs/verification_info_dialog.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/query_server_verification.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/verification_qr_code_processor.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/widgets/app_bars.dart' show CustomAppBar;
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

class VerificationQrScannerPage extends StatelessWidget {
  const VerificationQrScannerPage({super.key});

  @override
  Widget build(BuildContext context) {
    final config = Configuration.of(context);
    final settings = Provider.of<SettingsModel>(context);
    return Expanded(
      child: Column(
        children: [
          CustomAppBar(
            title: buildConfig.localization.ausweisen.verificationCodeScanner.title,
            actions: [
              IconButton(
                icon: const Icon(Icons.help),
                color: Theme.of(context).appBarTheme.foregroundColor,
                onPressed: () async {
                  await settings.setHideVerificationInfo(enabled: false);
                  await VerificationInfoDialog.show(context);
                },
              )
            ],
          ),
          Expanded(
            child: QrCodeScannerPage(
              onCodeScanned: (code) => _handleQrCode(context, code),
            ),
          ),
          if (config.showDevSettings)
            TextButton(
              onPressed: () async {
                final provider = Provider.of<ActivationCodeModel>(context, listen: false);
                final activationCode = provider.activationCode!;
                final otp = OTPGenerator(activationCode.totpSecret).generateOTP().code;
                final verifyQrCode = QrCode(
                  dynamicVerifyCode:
                      DynamicVerifyCode(info: activationCode.info, pepper: activationCode.pepper, otp: otp),
                );
                final verifyCodeBase64 = const Base64Encoder().convert(verifyQrCode.writeToBuffer());
                _handleQrCode(context, verifyCodeBase64);
              },
              child: const Text("Verify activated Card"),
            )
        ],
      ),
    );
  }

  Future<void> _handleQrCode(BuildContext context, String rawQrContent) async {
    _openWaitingDialog(context);

    final client = GraphQLProvider.of(context).value;
    try {
      final verifyCode = processQrCodeContent(rawQrContent);
      final projectId = Configuration.of(context).projectId;
      final valid = await queryServerVerification(client, projectId, verifyCode);
      if (!valid) {
        await _onError(
          context,
          "Der eingescannte Code konnte vom Server nicht verifiziert werden!",
        );
      } else {
        await _onSuccess(context, verifyCode.info);
      }
    } on ServerVerificationException catch (e) {
      await _onConnectionError(
        context,
        "Der eingescannte Code konnte nicht verifiziert "
        "werden, da die Kommunikation mit dem Server fehlschlug. "
        "Bitte prüfen Sie Ihre Internetverbindung.",
        e,
      );
    } on QrCodeFieldMissingException catch (e) {
      await _onError(
        context,
        "Der eingescannte Code ist nicht gültig, "
        "da erforderliche Daten fehlen.",
        e,
      );
    } on CardExpiredException catch (e) {
      final dateFormat = DateFormat("dd.MM.yyyy");
      await _onError(
        context,
        "Der eingescannte Code ist bereits am ${dateFormat.format(e.expiry)} abgelaufen.",
        e,
      );
    } on QrCodeParseException catch (e) {
      await _onError(
        context,
        "Der Inhalt des eingescannten Codes kann nicht verstanden "
        "werden. Vermutlich handelt es sich um einen QR-Code, der nicht für "
        "diese App generiert wurde.",
        e,
      );
    } on Exception catch (e) {
      await _onError(
        context,
        "Beim Einlesen des QR-Codes ist ein unbekannter Fehler aufgetreten.",
        e,
      );
    } finally {
      // close current "Karte verifizieren" view
      Navigator.of(context).pop();
    }
  }

  Future<void> _onError(BuildContext context, String message, [Exception? exception]) async {
    if (exception != null) {
      debugPrint("Verification failed: $exception");
    }
    _closeWaitingDialog(context);

    await NegativeVerificationResultDialog.show(context, message);
  }

  Future<void> _onConnectionError(BuildContext context, String message, [Exception? exception]) async {
    if (exception != null) {
      debugPrint("Connection failed: $exception");
    }
    _closeWaitingDialog(context);

    await InternetConnectionVerificationDialog.show(context, message);
  }

  Future<void> _onSuccess(BuildContext context, CardInfo cardInfo) async {
    _closeWaitingDialog(context);
    await PositiveVerificationResultDialog.show(context, cardInfo);
  }

  void _openWaitingDialog(BuildContext context) {
    showDialog(
      barrierDismissible: false,
      context: context,
      builder: (context) =>
          AlertDialog(title: Column(mainAxisSize: MainAxisSize.min, children: const [CircularProgressIndicator()])),
    );
  }

  void _closeWaitingDialog(BuildContext context) {
    Navigator.of(context, rootNavigator: true).pop();
  }
}
