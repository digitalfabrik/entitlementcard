import 'package:flutter/material.dart';

import 'qr_code_processor.dart';
import 'qr_code_scanner.dart';

typedef OnHelpClickedCallback = void Function();

class QrCodeScannerPage extends StatelessWidget {
  final OnCodeScannedCallback? onCodeScanned;
  final OnHelpClickedCallback? onHelpClicked;
  final String title;

  const QrCodeScannerPage(
      {Key? key, this.onCodeScanned, required this.title, this.onHelpClicked})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    var currentOnHelpClicked = onHelpClicked;
    return Scaffold(
        appBar: AppBar(
          title: Text(title),
          actions: [
            if (currentOnHelpClicked != null)
              IconButton(
                  icon: const Icon(Icons.help), onPressed: currentOnHelpClicked)
          ],
        ),
        body: QrCodeScanner(
          onCodeScanned: (code) async => await _onCodeScanned(context, code),
        ));
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
