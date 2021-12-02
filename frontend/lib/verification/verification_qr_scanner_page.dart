import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/identification/base_card_details.dart';
import 'package:ehrenamtskarte/widgets/navigation_bars.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../qr_code_scanner/qr_code_processor.dart';
import '../qr_code_scanner/qr_code_scanner_page.dart';
import 'dialogs/negative_verification_result_dialog.dart';
import 'dialogs/positive_verification_result_dialog.dart';
import 'dialogs/verification_info_dialog.dart';
import 'query_server_verification.dart';
import 'verification_qr_code_processor.dart';

class VerificationQrScannerPage extends StatelessWidget {
  const VerificationQrScannerPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsModel>(context);
    return Expanded(
      child: Column(
        children: [
          NavigationBar(
            title: "Karte verifizieren",
            actions: [
              IconButton(
                icon: const Icon(Icons.help),
                onPressed: () async {
                  await settings.setHideVerificationInfo(false);
                  await VerificationInfoDialog.show(context);
                },
              )
            ],
          ),
          Expanded(
            child: QrCodeScannerPage(
              onCodeScanned: (code) => _handleQrCode(context, code),
            ),
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
      final valid = await queryServerVerification(client, card);
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
      await _onError(
        context,
        "Die eingescannte Ehrenamtskarte konnte nicht verifiziert "
        "werden, da die Kommunikation mit dem Server fehlschlug.",
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
      // Should already be closed in any case, but we want to really be sure the
      // dialog eventually is closed.
      _closeWaitingDialog(context);
    }
  }

  Future<void> _onError(BuildContext context, String message, [Exception? exception]) async {
    if (exception != null) {
      debugPrint("Verification failed: $exception");
    }
    _closeWaitingDialog(context);

    await NegativeVerificationResultDialog.show(context, message);
  }

  Future<void> _onSuccess(BuildContext context, BaseCardDetails cardDetails) async {
    _closeWaitingDialog(context);
    await PositiveVerificationResultDialog.show(context, cardDetails);
  }

  void _openWaitingDialog(BuildContext context) async {
    await showDialog(
      barrierDismissible: false,
      context: context,
      builder: (context) =>
          AlertDialog(title: Column(mainAxisSize: MainAxisSize.min, children: const [CircularProgressIndicator()])),
    );
    Navigator.pop(context);
  }

  void _closeWaitingDialog(BuildContext context) {
    Navigator.pop(context);
  }
}
