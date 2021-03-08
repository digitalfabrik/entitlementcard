import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:intl/intl.dart';

import '../identification/base_card_details.dart';
import '../qr_code_scanner/qr_code_processor.dart';
import '../qr_code_scanner/qr_code_scanner_page.dart';
import 'dialogs/verification_info_dialog.dart';
import 'dialogs/verification_result_dialog.dart';
import 'query_server_verification.dart';
import 'verification_qr_code_processor.dart';

class VerificationWorkflow {
  BuildContext _waitingDialogContext;
  BuildContext _qrScannerContext;

  VerificationWorkflow._(); // hide the constructor

  static Future<void> startWorkflow(BuildContext context) =>
      VerificationWorkflow._().showInfoAndQrScanner(context);

  Future<void> showInfoAndQrScanner(BuildContext rootContext) async {
    // show info dialog and cancel if it is not accepted
    if (await VerificationInfoDialog.show(rootContext) != true) return;

    // show the QR scanner that will handle the rest
    await Navigator.push(rootContext,
        MaterialPageRoute(
          builder: (context) => QrCodeScannerPage(
            title: "Karte verifizieren",
            onCodeScanned: (code) => _handleQrCode(context, code),
          ),
        ));
  }

  Future<void> _handleQrCode(BuildContext qrScannerContext,
      String rawQrContent) async {
    _qrScannerContext = qrScannerContext;
    _openWaitingDialog();

    final client = GraphQLProvider.of(_qrScannerContext).value;
    try {
      final card = processQrCodeContent(rawQrContent);
      final valid = await queryServerVerification(client, card);
      if (!valid) {
        await _onError("Die zu prüfende Karte konnte vom Server nicht "
            "verifiziert werden!", "cardRejected");
      } else {
        await _onSuccess(card.cardDetails);
      }
    } on ServerVerificationException catch (e) {
      await _onError("Die eingescannte Ehrenamtskarte konnte nicht verifiziert "
        "werden, da die Kommunikation mit dem Server fehlschlug.",
        "verifyRequestError", e);
    } on QrCodeFieldMissingException catch (e) {
      await _onError("Die eingescannte Ehrenamtskarte ist nicht gültig, "
          "da erforderliche Daten fehlen.", "${e.missingFieldName}Missing", e);
    } on CardExpiredException catch (e) {
      final dateFormat = DateFormat("dd.MM.yyyy");
      await _onError("Die eingescannte Karte ist bereits am "
        "${dateFormat.format(e.expiry)} abgelaufen.", "cardExpired", e);
    } on QrCodeParseException catch (e) {
      await _onError("Der Inhalt des eingescannten Codes kann nicht verstanden "
        "werden. Vermutlich handelt es sich um einen QR-Code, der nicht für "
        "die Ehrenamtskarte-App generiert wurde.", "invalidFormat", e);
    } on Exception catch (e) {
      await _onError("Ein unbekannter Fehler beim Einlesen des QR-Codes ist "
        "aufgetreten.", "unknownError", e);
    } finally {
      // Should already be closed in any case, but we want to really be sure the
      // dialog eventually is closed.
      _closeWaitingDialog();
    }
  }

  Future<void> _onError(String message,
      [String errorCode, Exception exception]) async {
    if (exception != null) {
      print("Verification failed: ${exception.toString()}");
    }
    _closeWaitingDialog();
    await VerificationResultDialog.showFailure(_qrScannerContext, message,
        errorCode);
  }

  Future<void> _onSuccess(BaseCardDetails cardDetails) async {
    _closeWaitingDialog();
    await VerificationResultDialog.showSuccess(_qrScannerContext, cardDetails);
  }

  void _openWaitingDialog() {
    showDialog(context: _qrScannerContext, builder: (context) {
      _waitingDialogContext = context;
      return AlertDialog(
        title: Text("Einen Moment bitte …"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text("Wir überprüfen den gescannten Code für Sie."),
            SizedBox(height: 12),
            CircularProgressIndicator()
      ]));
    });
  }

  void _closeWaitingDialog() {
    if (_waitingDialogContext != null) {
      Navigator.pop(_waitingDialogContext);
      _waitingDialogContext = null;
    }
  }
}
