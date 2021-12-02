import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/verification/verification_qr_scanner_page.dart';
import 'package:flutter/material.dart';
import '../routing.dart';
import 'dialogs/verification_info_dialog.dart';

class VerificationWorkflow {
  VerificationWorkflow._(); // hide the constructor

  static Future<void> startWorkflow(BuildContext context, SettingsModel settings) =>
      VerificationWorkflow._().showInfoAndQrScanner(context, settings);

  Future<void> showInfoAndQrScanner(BuildContext rootContext, SettingsModel settings) async {
    if (settings.hideVerificationInfo != true) {
      // show info dialog and cancel if it is not accepted
      if (await VerificationInfoDialog.show(rootContext) != true) return;
    }

    // show the QR scanner that will handle the rest
    await Navigator.push(
      rootContext,
      AppRoute(
        builder: (context) {
          return const VerificationQrScannerPage();
        },
      ),
    );
  }
}
