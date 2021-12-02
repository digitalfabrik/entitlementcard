import 'package:flutter/material.dart';

import 'qr_code_processor.dart';
import 'qr_code_scanner.dart';

typedef OnHelpClickedCallback = void Function();

class QrCodeScannerPage extends StatelessWidget {
  final OnCodeScannedCallback? onCodeScanned;

  const QrCodeScannerPage({Key? key, this.onCodeScanned}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return QrCodeScanner(
      onCodeScanned: (code) async => _onCodeScanned(context, code),
    );
  }

  Future<void> _onCodeScanned(BuildContext context, String code) async {
    final currentOnCodeScanned = onCodeScanned;
    try {
      if (currentOnCodeScanned != null) {
        await currentOnCodeScanned(code);
      }
    } on QrCodeParseException catch (e, stackTrace) {
      debugPrintStack(stackTrace: stackTrace, label: e.toString());
    }

    if (Navigator.canPop(context)) Navigator.maybePop(context);
  }
}
