import 'dart:math';

import 'package:ehrenamtskarte/qr_code_scanner/qr_code_scanner_controls.dart';
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

const scanDelayAfterErrorMs = 500;

typedef OnCodeScannedCallback = Future<void> Function(String code);

class QrCodeScanner extends StatefulWidget {
  final OnCodeScannedCallback onCodeScanned;

  const QrCodeScanner({super.key, required this.onCodeScanned});

  @override
  State<QrCodeScanner> createState() => _QRViewState();
}

class _QRViewState extends State<QrCodeScanner> {
  final MobileScannerController _controller = MobileScannerController(
    torchEnabled: false,
    formats: [BarcodeFormat.qrCode],
  );
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  bool isProcessingCode = false;

  @override
  Widget build(BuildContext context) {
    final controller = _controller;
    return Column(
      children: <Widget>[
        Expanded(
          flex: 4,
          child: Stack(
            children: [
              MobileScanner(
                key: qrKey,
                onDetect: (barcode, args) => _onCodeScanned(barcode),
                allowDuplicates: false,
                controller: controller,
              ),
              Center(
                child: Container(
                  width: _calculateScanArea(context),
                  height: _calculateScanArea(context),
                  decoration: BoxDecoration(
                    color: Colors.transparent,
                    border: Border.all(
                        color: Theme.of(context).colorScheme.secondary,
                        width: 10,
                    ),
                    borderRadius: const BorderRadius.all(Radius.circular(10.0)),
                  ),
                ),
              ),
            ],
          ),
        ),
        Expanded(
          flex: 1,
          child: FittedBox(
            fit: BoxFit.contain,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: <Widget>[
                Container(
                  margin: const EdgeInsets.all(8),
                  child: const Text('Halten Sie die Kamera auf den QR Code.'),
                ),
                QrCodeScannerControls(controller: controller)
              ],
            ),
          ),
        )
      ],
    );
  }

  double _calculateScanArea(BuildContext context) {
    final deviceHeight = MediaQuery.of(context).size.height;
    final deviceWidth = MediaQuery.of(context).size.width;

    // QR-Codes in the scan area can be smaller than the scan area itself
    // If the scan area is too small big qr codes stop working on iOS
    const scanArea = 300.0;
    final smallestDimension = min(deviceWidth, deviceHeight);
    if (smallestDimension < scanArea * 1.1) {
      return smallestDimension * 0.9;
    }
    return scanArea;
  }

  Future<void> _onCodeScanned(Barcode scanData) async {
    final controller = _controller;
    final code = scanData.rawValue;
    if (code == null) {
      return;
    }

    await widget.onCodeScanned(code);
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }
}
