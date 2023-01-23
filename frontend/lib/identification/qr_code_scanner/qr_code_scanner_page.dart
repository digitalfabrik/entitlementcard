import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_scanner.dart';
import 'package:flutter/material.dart';

typedef OnHelpClickedCallback = void Function();

class QrCodeScannerPage extends StatelessWidget {
  final OnCodeScannedCallback? onCodeScanned;

  const QrCodeScannerPage({super.key, this.onCodeScanned});

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
