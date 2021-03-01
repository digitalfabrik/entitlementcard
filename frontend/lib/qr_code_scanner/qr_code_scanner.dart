import 'dart:io';
import 'dart:math';

import 'package:ehrenamtskarte/qr_code_scanner/qr_code_scanner_controls.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';

import 'qr_code_parser.dart';

const scanDelayAfterErrorMs = 500;

class QRCodeScanner extends StatefulWidget {
  final QRCodeContentParser qrCodeContentParser;

  const QRCodeScanner({Key key, @required this.qrCodeContentParser})
      : super(key: key);

  @override
  State<QRCodeScanner> createState() => _QRViewState();
}

class _QRViewState extends State<QRCodeScanner> {
  Barcode result;
  QRViewController controller;
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  bool isProcessingCode = false;

  // In order to get hot reload to work we need to pause the camera if the
  // platform is android, or resume the camera if the platform is iOS.
  @override
  void reassemble() {
    super.reassemble();
    if (Platform.isAndroid) {
      controller.pauseCamera();
    } else if (Platform.isIOS) {
      controller.resumeCamera();
    }
  }

  @override
  Widget build(BuildContext context) {
    isProcessingCode = false;
    return Scaffold(
      body: Column(
        children: <Widget>[
          Expanded(
              flex: 4,
              child: Scaffold(
                appBar: AppBar(
                  leading: IconButton(
                    icon: Icon(
                      Icons.arrow_back_ios,
                      color: Theme.of(context).textTheme.bodyText1.color,
                    ),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                  title: Text("Ehrenamtskarte hinzufügen"),
                ),
                body: _buildQrView(context),
              )),
          Expanded(
            flex: 1,
            child: FittedBox(
              fit: BoxFit.contain,
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: <Widget>[
                    Container(
                      margin: EdgeInsets.all(8),
                      child: Text('Halten Sie die Kamera auf den QR Code.'),
                    ),
                    if (controller != null)
                      QRCodeScannerControls(controller: controller)
                  ],
              ),
            )
          )
        ],
      ),
    );
  }

  Widget _buildQrView(BuildContext context) {
    final deviceHeight = MediaQuery.of(context).size.height;
    final deviceWidth = MediaQuery.of(context).size.width;

    // QR-Codes in the scan area can be smaller than the scan area itself
    // If the scan area is too small big qr codes stop working on iOS
    var scanArea = 300.0;
    final smallestDimension = min(deviceWidth, deviceHeight);
    if (smallestDimension < scanArea * 1.1) {
      scanArea = smallestDimension * 0.9;
    }
    return QRView(
        key: qrKey,
        onQRViewCreated: _onQRViewCreated,
        overlay: QrScannerOverlayShape(
          borderColor: Colors.red,
          borderRadius: 10,
          borderLength: 30,
          borderWidth: 10,
          cutOutSize: scanArea,
        ),
      );
  }

  void _onQRViewCreated(QRViewController controller) {
    setState(() {
      this.controller = controller;
    });
    controller.scannedDataStream.listen((scanData) {
      if (scanData != null) {
        _tryParseCodeContent(scanData.code);
      }
    });
  }

  void _tryParseCodeContent(String codeContent) async {
    var wasSuccessful = false;
    // needed because this method gets called multiple times in a row after one
    // qr code gets detected, therefore we need to protect it
    if (isProcessingCode) {
      return;
    }
    isProcessingCode = true;
    controller.pauseCamera();
    final parseResult = widget.qrCodeContentParser(codeContent);
    if (parseResult.hasError) {
      print("Failed to parse qr code content!");
      final errorMessage = parseResult.userErrorMessage;
      _showErrorDialog(errorMessage).then((value) {
        // give the user time to move the camara away from the qr code
        // that caused the error
        Future.delayed(Duration(milliseconds: scanDelayAfterErrorMs))
            .then((onValue) {
          controller.resumeCamera();
          isProcessingCode = false;
        });
      });
    } else {
      wasSuccessful = true;
    }
    if (wasSuccessful) {
      Navigator.of(context).maybePop();
    }
  }

  Future<void> _showErrorDialog(String message) async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false, // user must tap button!
      builder: (context) {
        return AlertDialog(
          title: Text('Fehler beim Lesen des Codes'),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text(message),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Ok'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }
}
