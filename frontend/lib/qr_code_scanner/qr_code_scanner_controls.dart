import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';

class QRCodeScannerControls extends StatelessWidget {
  final QRViewController controller;

  // Not really nice. We need to update the button texts after we pressed them.
  // Other possibility would be to convert this to a stateful widget without
  // state and just call setState({}) to trigger redrawing of whole widget.
  final StreamController<bool> flashStreamController = StreamController();
  final StreamController<CameraFacing> cameraStreamController =
    StreamController<CameraFacing>();

  QRCodeScannerControls({
    @required this.controller,
    Key key
  }) : super(key: key) {
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
        future: controller.getSystemFeatures(),
        builder: (context, snapshot) =>
      snapshot.hasData ? Row(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            if (snapshot.data.hasFlash)
              Container(
                margin: EdgeInsets.all(8),
                child: OutlineButton(
                    onPressed: () =>
                        controller.toggleFlash()
                            .whenComplete(updateFlashStream),
                    child: StreamBuilder<bool>(
                      stream: flashStreamController.stream,
                      builder: (ctx, snapshot) =>
                          Text(snapshot.data ?? false
                              ? "Blitz aus" : "Blitz an",
                              style: TextStyle(fontSize: 16)),
                    )
                ),
              ),
            if (snapshot.data.hasBackCamera && snapshot.data.hasFrontCamera)
              Container(
                margin: EdgeInsets.all(8),
                child: OutlineButton(
                    onPressed: () =>
                        controller.flipCamera()
                            .whenComplete(updateCameraStream),
                    child: StreamBuilder<CameraFacing>(
                      stream: cameraStreamController.stream,
                      builder: (ctx, snapshot) =>
                          Text(snapshot.data == CameraFacing.back ?
                          "Frontkamera" : "Standard-Kamera",
                              style: TextStyle(fontSize: 16)),
                    )
                ),
              )
          ]
      )
          : Text(snapshot.hasError
              ? "Kein Zugriff auf Systemeigenschaften." : "Lade …")
    );
  }
}
