import 'dart:io';
import 'dart:math';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';

import '../card_details_model.dart';
import '../jwt/invalid_jwt_exception.dart';
import 'qr_code_parser.dart';

const flashOn = 'Blitz an';
const flashOff = 'Blitz aus';
const frontCamera = 'Frontkamera';
const backCamera = 'Standard Kamera';

const scanDelayAfterErrorMs = 500;

class QRCodeScanner extends StatefulWidget {
  const QRCodeScanner({
    Key key,
  }) : super(key: key);

  @override
  State<QRCodeScanner> createState() => _QRViewState();
}

class _QRViewState extends State<QRCodeScanner> {
  Barcode result;
  var flashState = flashOn;
  var cameraState = frontCamera;
  QRViewController controller;
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  bool isDone = false;
  bool isErrorDialogActive = false;

  // In order to get hot reload to work we need to pause the camera if the platform
  // is android, or resume the camera if the platform is iOS.
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
    isDone = false;
    return Scaffold(
      body: Column(
        children: <Widget>[
          Expanded(
              flex: 4,
              child: Scaffold(
                appBar: AppBar(
                  leading: new IconButton(
                    icon: new Icon(
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
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: <Widget>[
                      Container(
                        margin: EdgeInsets.all(8),
                        child: OutlineButton(
                          onPressed: () {
                            if (controller != null) {
                              controller.toggleFlash();
                              setState(() {
                                flashState =
                                    _isFlashOn(flashState) ? flashOff : flashOn;
                              });
                            }
                          },
                          child:
                              Text(flashState, style: TextStyle(fontSize: 16)),
                        ),
                      ),
                      Container(
                        margin: EdgeInsets.all(8),
                        child: OutlineButton(
                          onPressed: () {
                            if (controller != null) {
                              controller.flipCamera();
                              setState(() {
                                cameraState = _isBackCamera(cameraState)
                                    ? frontCamera
                                    : backCamera;
                              });
                            }
                          },
                          child:
                              Text(cameraState, style: TextStyle(fontSize: 16)),
                        ),
                      )
                    ],
                  ),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }

  bool _isFlashOn(String current) {
    return flashOn == current;
  }

  bool _isBackCamera(String current) {
    return backCamera == current;
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
    print("QR Code Scan area is: $scanArea");
    // To ensure the Scanner view is properly sized after rotation
    // we need to listen for Flutter SizeChanged notification and update controller
    return NotificationListener<SizeChangedLayoutNotification>(
        onNotification: (notification) {
          Future.microtask(
              () => controller?.updateDimensions(qrKey, scanArea: scanArea));
          return false;
        },
        child: SizeChangedLayoutNotifier(
            key: const Key('qr-size-notifier'),
            child: QRView(
              key: qrKey,
              onQRViewCreated: _onQRViewCreated,
              overlay: QrScannerOverlayShape(
                borderColor: Colors.red,
                borderRadius: 10,
                borderLength: 30,
                borderWidth: 10,
                cutOutSize: scanArea,
              ),
            )));
  }

  void _onQRViewCreated(QRViewController controller) {
    this.controller = controller;
    controller.scannedDataStream.listen((scanData) {
      if (scanData != null) {
        _tryParseCodeContent(scanData.code);
      }
    });
  }

  void _tryParseCodeContent(String codeContent) {
    try {
      final cardDetails = parseQRCodeContent(codeContent);
      // TODO this method gets called multiple times in a row for some reason
      // The following code should be exclusive, but dart does not natively
      // support mutexes, synchronized, etc.
      if (isDone) {
        return;
      }
      isDone = true;
      Provider.of<CardDetailsModel>(context, listen: false)
          .setCardDetails(cardDetails);
      Navigator.of(context).maybePop();
    } catch (e) {
      controller.pauseCamera();
      print("Failed to parse qr code content!");
      print(e);
      String errorMessage;
      if (e is InvalidJwtException) {
        errorMessage =
            "Der Inhalt des QR-Codes kann von der App nicht verstanden werden.";
      } else {
        errorMessage = e.toString();
      }
      if (isErrorDialogActive) {
        return;
      }
      isErrorDialogActive = true;
      _showErrorDialog(errorMessage).then((value) {
        Future.delayed(Duration(milliseconds: scanDelayAfterErrorMs))
            .then((onValue) {
          isErrorDialogActive = false;
          controller.resumeCamera();
        });
      });
    }
  }

  Future<void> _showErrorDialog(String message) async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false, // user must tap button!
      builder: (BuildContext context) {
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
