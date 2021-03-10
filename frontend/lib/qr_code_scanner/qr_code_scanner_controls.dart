import 'dart:async';

import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';

class QrCodeScannerControls extends StatelessWidget {
  final QRViewController controller;

  // Not really nice. We need to update the button texts after we pressed them.
  // Other possibility would be to convert this to a stateful widget without
  // state and just call setState({}) to trigger redrawing of whole widget.
  final StreamController<bool> flashStreamController = StreamController();
  final StreamController<CameraFacing> cameraStreamController =
      StreamController<CameraFacing>();

  QrCodeScannerControls({@required this.controller, Key key})
      : super(key: key) {
    updateFlashStream();
    updateCameraStream();
  }

  Future<void> updateFlashStream() =>
      controller.getFlashStatus().then(flashStreamController.add);
  Future<void> updateCameraStream() =>
      controller.getCameraInfo().then(cameraStreamController.add);

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<SystemFeatures>(
        future: _tryToGetSystemFeatures(),
        builder: (context, snapshot) => Row(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: <Widget>[
                  if (snapshot.data != null && snapshot.data.hasFlash)
                    Container(
                      margin: EdgeInsets.all(8),
                      child: OutlinedButton(
                          onPressed: () => controller
                              .toggleFlash()
                              .whenComplete(updateFlashStream),
                          child: StreamBuilder<bool>(
                            stream: flashStreamController.stream,
                            builder: (ctx, snapshot) => Text(
                                snapshot.data ?? false
                                    ? "Blitz aus"
                                    : "Blitz an",
                                style: TextStyle(fontSize: 16)),
                          )),
                    ),
                  if (snapshot.data != null &&
                      snapshot.data.hasBackCamera &&
                      snapshot.data.hasFrontCamera)
                    Container(
                      margin: EdgeInsets.all(8),
                      child: OutlinedButton(
                          onPressed: () => controller
                              .flipCamera()
                              .whenComplete(updateCameraStream),
                          child: StreamBuilder<CameraFacing>(
                            stream: cameraStreamController.stream,
                            builder: (ctx, snapshot) => Text(
                                snapshot.data == CameraFacing.back
                                    ? "Frontkamera"
                                    : "Standard-Kamera",
                                style: TextStyle(fontSize: 16)),
                          )),
                    )
                ]));
  }

  Future<SystemFeatures> _tryToGetSystemFeatures() async {
    for (var i = 0; i < 10; i++) {
      try {
        return await controller.getSystemFeatures();
      } on CameraException {
        await Future.delayed(Duration(milliseconds: 50));
      }
    }
    return SystemFeatures(true, true, true);
  }
}
