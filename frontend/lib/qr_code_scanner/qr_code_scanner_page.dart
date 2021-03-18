import 'package:flutter/material.dart';

import 'qr_code_processor.dart';
import 'qr_code_scanner.dart';

typedef OnHelpClickedCallback = void Function();

class QrCodeScannerPage extends StatelessWidget {
  final OnCodeScannedCallback onCodeScanned;
  final OnHelpClickedCallback onHelpClicked;
  final String title;

  QrCodeScannerPage({Key key, @required this.onCodeScanned,
    @required this.title, this.onHelpClicked})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
          appBar: AppBar(
          title: Text(title),
          actions: [
            if (onHelpClicked != null)
              IconButton(icon: Icon(Icons.help), onPressed: onHelpClicked)
          ],
      ),
      body: QrCodeScanner(
        onCodeScanned: (code) async => await _onCodeScanned(context, code),
      )
    );
  }

  Future<void> _onCodeScanned(BuildContext context, String code) async {
    try {
      if (onCodeScanned != null) {
        await onCodeScanned(code);
      }
    } on QrCodeParseException catch (e, stackTrace) {
      debugPrintStack(stackTrace: stackTrace, label: e?.toString());
    }

    if (Navigator.canPop(context)) Navigator.maybePop(context);
  }
}
