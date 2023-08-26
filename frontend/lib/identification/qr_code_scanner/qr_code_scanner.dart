import 'dart:math';
import 'dart:typed_data';

import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_scanner_controls.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_overlay_shape.dart';
import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

typedef OnCodeScannedCallback = Future<void> Function(Uint8List code);

class QrCodeScanner extends StatefulWidget {
  final OnCodeScannedCallback onCodeScanned;

  const QrCodeScanner({super.key, required this.onCodeScanned});

  @override
  State<QrCodeScanner> createState() => _QRViewState();
}

class _QRViewState extends State<QrCodeScanner> {
  final MobileScannerController _controller = MobileScannerController(
    torchEnabled: false,
    detectionSpeed: DetectionSpeed.normal,
    formats: [BarcodeFormat.qrCode],
    returnImage: false,
  );
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');

  // Determines whether a code is currently processed by the onCodeScanned callback
  // During this time, we do not re-trigger the callback.
  bool processingCode = false;

  bool showWaiting = false;

  @override
  Widget build(BuildContext context) {
    final controller = _controller;
    return Stack(
      children: [
        Column(
          children: <Widget>[
            Expanded(
              flex: 4,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  MobileScanner(
                    key: qrKey,
                    placeholderBuilder: (context, _) => Align(
                      alignment: Alignment.center,
                      child: Icon(Icons.camera_alt_outlined, size: 128, color: Colors.grey),
                    ),
                    onDetect: (barcodes) => _onCodeScanned(barcodes),
                    controller: controller,
                  ),
                  DecoratedBox(
                    decoration: ShapeDecoration(
                      shape: QrScannerOverlayShape(
                        borderRadius: 10,
                        borderColor: Theme.of(context).colorScheme.secondary,
                        borderLength: 30,
                        borderWidth: 10,
                        cutOutSize: _calculateScanArea(context),
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
                  children: [
                    Container(
                      margin: const EdgeInsets.all(8),
                      child: I18nText('scanQRCode'),
                    ),
                    QrCodeScannerControls(controller: controller)
                  ],
                ),
              ),
            )
          ],
        ),
        if (showWaiting)
          Center(
              child: Card(
                  child: Padding(
            padding: const EdgeInsets.all(32),
            child: CircularProgressIndicator(),
          ))),
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

  Future<void> _onCodeScanned(BarcodeCapture capture) async {
    if (capture.barcodes.length != 1) return;
    final barcode = capture.barcodes[0];
    final code = barcode.rawBytes;
    if (code == null) return;

    if (processingCode) return;
    setState(() {
      processingCode = true;
      showWaiting = true;
    });
    try {
      await widget.onCodeScanned(code);
    } finally {
      setState(() {
        showWaiting = false;
      });
      await Future.delayed(Duration(milliseconds: 500));
      processingCode = false;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}
