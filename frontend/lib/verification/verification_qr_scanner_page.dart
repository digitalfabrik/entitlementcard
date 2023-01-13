import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/identification/base_card_details.dart';
import 'package:ehrenamtskarte/identification/card_details_model.dart';
import 'package:ehrenamtskarte/identification/otp_generator.dart';
import 'package:ehrenamtskarte/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/qr_code_scanner/qr_code_scanner_page.dart';
import 'package:ehrenamtskarte/verification/dialogs/internet_connection_verification_dialog.dart';
import 'package:ehrenamtskarte/verification/dialogs/negative_verification_result_dialog.dart';
import 'package:ehrenamtskarte/verification/dialogs/positive_verification_result_dialog.dart';
import 'package:ehrenamtskarte/verification/dialogs/verification_info_dialog.dart';
import 'package:ehrenamtskarte/verification/query_server_verification.dart';
import 'package:ehrenamtskarte/verification/scanner/verification_encoder.dart';
import 'package:ehrenamtskarte/verification/verification_card_details.dart';
import 'package:ehrenamtskarte/verification/verification_qr_code_processor.dart';
import 'package:ehrenamtskarte/widgets/navigation_bars.dart' as nav_bars;
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
          nav_bars.NavigationBar(
            title: "Karte verifizieren",
            actions: [
              IconButton(
                icon: const Icon(Icons.help),
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
                final provider = Provider.of<CardDetailsModel>(context, listen: false);
                final cardDetails = provider.cardDetails!;
                final generator = OTPGenerator(cardDetails.totpSecretBase32);
                final verifyCodeBase64 =
                    encodeVerificationCardDetails(VerificationCardDetails(cardDetails, generator.generateOTP().code));
                _handleQrCode(context, verifyCodeBase64);
              },
              child: const Text("Self Verify"),
            )
        ],
      ),
    );
  }

  Future<void> _handleQrCode(BuildContext context, String rawQrContent) async {
    _openWaitingDialog(context);

    final client = GraphQLProvider.of(context).value;
    try {
      final card = processQrCodeContent(rawQrContent);
      final projectId = Configuration.of(context).projectId;
      final valid = await queryServerVerification(client, projectId, card);
      if (!valid) {
        await _onError(
          context,
          "Die zu prüfende Karte konnte vom Server nicht "
          "verifiziert werden!",
        );
      } else {
        await _onSuccess(context, card.cardDetails);
      }
    } on ServerVerificationException catch (e) {
      await _onConnectionError(
        context,
        "Die eingescannte Ehrenamtskarte konnte nicht verifiziert "
        "werden, da die Kommunikation mit dem Server fehlschlug. "
        "Bitte prüfen Sie Ihre Internetverbindung.",
        e,
      );
    } on QrCodeFieldMissingException catch (e) {
      await _onError(
        context,
        "Die eingescannte Ehrenamtskarte ist nicht gültig, "
        "da erforderliche Daten fehlen.",
        e,
      );
    } on CardExpiredException catch (e) {
      final dateFormat = DateFormat("dd.MM.yyyy");
      await _onError(
        context,
        "Die eingescannte Karte ist bereits am "
        "${dateFormat.format(e.expiry)} abgelaufen.",
        e,
      );
    } on QrCodeParseException catch (e) {
      await _onError(
        context,
        "Der Inhalt des eingescannten Codes kann nicht verstanden "
        "werden. Vermutlich handelt es sich um einen QR-Code, der nicht für "
        "die Ehrenamtskarte-App generiert wurde.",
        e,
      );
    } on Exception catch (e) {
      await _onError(
        context,
        "Ein unbekannter Fehler beim Einlesen des QR-Codes ist "
        "aufgetreten.",
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

  Future<void> _onSuccess(BuildContext context, BaseCardDetails cardDetails) async {
    _closeWaitingDialog(context);
    await PositiveVerificationResultDialog.show(context, cardDetails);
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
