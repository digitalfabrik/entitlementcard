import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/dialogs/verification_info_dialog.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/verification_qr_scanner_page.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/routing.dart';
import 'package:flutter/material.dart';

class VerificationWorkflow {
  VerificationWorkflow._(); // hide the constructor

  static Future<void> startWorkflow(BuildContext context, SettingsModel settings, DynamicUserCode? userCode) =>
      VerificationWorkflow._().showInfoAndQrScanner(context, settings, userCode);

  Future<void> showInfoAndQrScanner(BuildContext rootContext, SettingsModel settings, DynamicUserCode? userCode) async {
    if (settings.hideVerificationInfo != true) {
      // show info dialog and cancel if it is not accepted
      if (await VerificationInfoDialog.show(rootContext) != true) return;
    }

    // show the QR scanner that will handle the rest
    await Navigator.push(
      rootContext,
      AppRoute(
        builder: (context) {
          return VerificationQrScannerPage(userCode: userCode);
        },
      ),
    );
  }
}
