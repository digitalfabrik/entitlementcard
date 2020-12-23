import 'package:provider/provider.dart';

import '../card_details_model.dart';

import '../card_details.dart';
import '../jwt/parse_jwt.dart';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'dart:io';

import 'package:qr_code_scanner/qr_code_scanner.dart';

const flashOn = 'Blitz an';
const flashOff = 'Blitz aus';
const frontCamera = 'Frontkamera';
const backCamera = 'Standard Kamera';

class QRCodeScanner extends StatefulWidget {
  const QRCodeScanner({
    Key key,
  }) : super(key: key);

  @override
  State<QRCodeScanner> createState() => _QRViewExampleState();
}

class _QRViewExampleState extends State<QRCodeScanner> {
  Barcode result;
  var flashState = flashOn;
  var cameraState = frontCamera;
  QRViewController controller;
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  bool isDone = false;

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
    // For this example we check how width or tall the device is and change the scanArea and overlay accordingly.
    var scanArea = (MediaQuery.of(context).size.width < 400 ||
            MediaQuery.of(context).size.height < 400)
        ? 150.0
        : 300.0;
    // To ensure the Scanner view is properly sizes after rotation
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
      result = scanData;
      print("Scan successful, reading payload...");
      try {
        var payload = parseJwtPayLoad(result.code);
        var cardDetails = CardDetails(
            payload["firstName"] ?? "",
            payload["lastName"] ?? "",
            DateTime.parse(payload["expirationDate"]) ?? "",
            payload["region"] ?? "");
        if (isDone) {
          return;
        }
        isDone = true;
        Provider.of<CardDetailsModel>(context, listen: false)
            .setCardDetails(cardDetails);
        Navigator.of(context).maybePop();
      } on Exception {
        print("Failed to parse qr code content!");
      }
    });
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }
}
