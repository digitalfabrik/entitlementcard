import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/verification/dialogs/verification_info_dialog.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'qr_code_processor.dart';
import 'qr_code_scanner.dart';

typedef OnHelpClickedCallback = void Function();

class QrCodeScannerPage extends StatelessWidget {
  final OnCodeScannedCallback? onCodeScanned;

  const QrCodeScannerPage({Key? key, this.onCodeScanned}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsModel>(context);
    
    return Expanded(
        child: Column(children: [
      AppBar(
        backgroundColor: Colors.transparent,
        title: const Text("Karte verifizieren"),
        actions: [
          IconButton(
              icon: const Icon(Icons.help),
              onPressed: () async {
                await settings.setHideVerificationInfo(false);
                await VerificationInfoDialog.show(context);
              })
        ],
      ),
      Expanded(
          child: QrCodeScanner(
        onCodeScanned: (code) async => await _onCodeScanned(context, code),
      ))
    ]));
  }

  Future<void> _onCodeScanned(BuildContext context, String code) async {
    var currentOnCodeScanned = onCodeScanned;
    try {
      if (currentOnCodeScanned != null) {
        await currentOnCodeScanned(code);
      }
    } on QrCodeParseException catch (e, stackTrace) {
      debugPrintStack(stackTrace: stackTrace, label: e?.toString());
    }

    if (Navigator.canPop(context)) Navigator.maybePop(context);
  }
}
