import 'dart:developer';

import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../identification/base_card_details.dart';
import '../qr_code_scanner/qr_code_processor.dart';
import '../qr_code_scanner/qr_code_scanner_page.dart';
import 'dialogs/negative_verification_result_dialog.dart';
import 'dialogs/positive_verification_result_dialog.dart';
import 'dialogs/verification_info_dialog.dart';
import 'query_server_verification.dart';
import 'verification_qr_code_processor.dart';

class VerificationWorkflow {
  BuildContext? _waitingDialogContext;
  BuildContext? _qrScannerContext;
  bool _userCancelled = false;

  VerificationWorkflow._(); // hide the constructor

  static Future<void> startWorkflow(BuildContext context, SettingsModel settings) =>
      VerificationWorkflow._().showInfoAndQrScanner(context, settings);

  Future<void> showInfoAndQrScanner(BuildContext rootContext, SettingsModel settings) async {
    if (await settings.hideVerificationInfo != true) {
      // show info dialog and cancel if it is not accepted
      if (await VerificationInfoDialog.show(rootContext) != true) return;
    }

    // show the QR scanner that will handle the rest
    await Navigator.push(
        rootContext,
        MaterialPageRoute(
          builder: (context) => QrCodeScannerPage(
              title: "Karte verifizieren",
              onCodeScanned: (code) => _handleQrCode(context, code),
              onHelpClicked: () async {
                await settings.setHideVerificationInfo(false);
                await VerificationInfoDialog.show(context);
              }),
        ));
  }

  Future<void> _handleQrCode(
      BuildContext qrScannerContext, String rawQrContent) async {
    _qrScannerContext = qrScannerContext;
    _openWaitingDialog();

    final client = GraphQLProvider.of(qrScannerContext).value;
    try {
      final card = processQrCodeContent(rawQrContent);
      final valid = await queryServerVerification(client, card);
      if (!valid) {
        await _onError("Die zu prüfende Karte konnte vom Server nicht "
            "verifiziert werden!");
      } else {
        await _onSuccess(card.cardDetails);
      }
    } on ServerVerificationException catch (e) {
      await _onError(
          "Die eingescannte Ehrenamtskarte konnte nicht verifiziert "
          "werden, da die Kommunikation mit dem Server fehlschlug.",
          e);
    } on QrCodeFieldMissingException catch (e) {
      await _onError(
          "Die eingescannte Ehrenamtskarte ist nicht gültig, "
          "da erforderliche Daten fehlen.",
          e);
    } on CardExpiredException catch (e) {
      final dateFormat = DateFormat("dd.MM.yyyy");
      await _onError(
          "Die eingescannte Karte ist bereits am "
          "${dateFormat.format(e.expiry)} abgelaufen.",
          e);
    } on QrCodeParseException catch (e) {
      await _onError(
          "Der Inhalt des eingescannten Codes kann nicht verstanden "
          "werden. Vermutlich handelt es sich um einen QR-Code, der nicht für "
          "die Ehrenamtskarte-App generiert wurde.",
          e);
    } on Exception catch (e) {
      await _onError(
          "Ein unbekannter Fehler beim Einlesen des QR-Codes ist "
          "aufgetreten.",
          e);
    } finally {
      // Should already be closed in any case, but we want to really be sure the
      // dialog eventually is closed.
      _closeWaitingDialog();
    }
  }

  Future<void> _onError(String message, [Exception? exception]) async {
    if (exception != null) {
      log("Verification failed.", error: exception);
    }
    var qrScannerContext = _qrScannerContext;
    if (qrScannerContext == null) {
      return;
    }
    if (_userCancelled) return;
    _closeWaitingDialog();

    await NegativeVerificationResultDialog.show(qrScannerContext, message);
  }

  Future<void> _onSuccess(BaseCardDetails cardDetails) async {
    var qrScannerContext = _qrScannerContext;
    if (qrScannerContext == null) {
      return;
    }
    if (_userCancelled) return;
    _closeWaitingDialog();
    await PositiveVerificationResultDialog.show(qrScannerContext, cardDetails);
  }

  void _openWaitingDialog() {
    var qrScannerContext = _qrScannerContext;
    if (qrScannerContext == null) {
      return;
    }
    showDialog(
        context: qrScannerContext,
        builder: (context) {
          _waitingDialogContext = context;
          return AlertDialog(
              title: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: const [CircularProgressIndicator()]));
        }).whenComplete(() {
      _userCancelled = true;
      Navigator.pop(qrScannerContext);
      _waitingDialogContext = null;
    });
  }

  void _closeWaitingDialog() {
    var waitingDialogContext = _waitingDialogContext;
    if (waitingDialogContext != null) {
      Navigator.pop(waitingDialogContext);
      _waitingDialogContext = null;
    }
  }
}
