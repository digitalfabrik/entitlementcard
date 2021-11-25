import 'dart:math';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';

import 'qr_code_scanner_controls.dart';

const scanDelayAfterErrorMs = 500;

typedef OnCodeScannedCallback = Future<void> Function(String code);

class QrCodeScanner extends StatefulWidget {
  final OnCodeScannedCallback onCodeScanned;

  const QrCodeScanner({Key? key, required this.onCodeScanned})
      : super(key: key);

  @override
  State<QrCodeScanner> createState() => _QRViewState();
}

class _QRViewState extends State<QrCodeScanner> {
  QRViewController? _controller;
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  bool isProcessingCode = false;

  @override
  Widget build(BuildContext context) {
    final controller = _controller;
    return Column(
      children: <Widget>[
        Expanded(
          flex: 4,
          child: QRView(
            key: qrKey,
            onQRViewCreated: _onQrViewCreated,
            overlay: QrScannerOverlayShape(
              borderColor: Theme.of(context).colorScheme.secondary,
              borderRadius: 10,
              borderLength: 30,
              borderWidth: 10,
              cutOutSize: _calculateScanArea(context),
            ),
          ),
        ),
        if (controller != null)
          Expanded(
              flex: 1,
              child: FittedBox(
                fit: BoxFit.contain,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: <Widget>[
                    Container(
                      margin: const EdgeInsets.all(8),
                      child:
                          const Text('Halten Sie die Kamera auf den QR Code.'),
                    ),
                    QrCodeScannerControls(controller: controller)
                  ],
                ),
              ))
      ],
    );
  }

  double _calculateScanArea(BuildContext context) {
    final deviceHeight = MediaQuery.of(context).size.height;
    final deviceWidth = MediaQuery.of(context).size.width;

    // QR-Codes in the scan area can be smaller than the scan area itself
    // If the scan area is too small big qr codes stop working on iOS
    var scanArea = 300.0;
    final smallestDimension = min(deviceWidth, deviceHeight);
    if (smallestDimension < scanArea * 1.1) {
      return smallestDimension * 0.9;
    }
    return scanArea;
  }

  void _onQrViewCreated(QRViewController controller) {
    setState(() {
      _controller = controller;
    });
    controller.scannedDataStream.listen(_onCodeScanned);
  }

  void _onCodeScanned(Barcode scanData) async {
    final controller = _controller;
    var code = scanData.code;
    if (controller == null) {
      return;
    }

    // needed because this method gets called multiple times in a row after one
    // qr code gets detected, therefore we need to protect it
    if (isProcessingCode) {
      return;
    }
    isProcessingCode = true;
    controller.pauseCamera();

    await widget.onCodeScanned(code);

    // give the user time to move the camara away from the qr code
    await Future.delayed(const Duration(milliseconds: scanDelayAfterErrorMs));

    if (mounted) {
      controller.resumeCamera();
    }
    isProcessingCode = false;
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }
}
