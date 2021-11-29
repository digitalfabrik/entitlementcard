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

  QrCodeScannerControls({Key? key, required this.controller})
      : super(key: key) {
    updateFlashStream();
    updateCameraStream();
  }

  Future<void> updateFlashStream() => controller
      .getFlashStatus()
      .then((flashStatus) => flashStreamController.add(flashStatus ?? false));

  Future<void> updateCameraStream() =>
      controller.getCameraInfo().then(cameraStreamController.add);

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<SystemFeatures>(
        future: _tryToGetSystemFeatures(),
        builder: (context, snapshot) {
          SystemFeatures? systemFeatures = snapshot.data;

          if (snapshot.hasData || systemFeatures == null) {
            return const Center();
          }

          return Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                if (systemFeatures.hasFlash)
                  Container(
                    margin: const EdgeInsets.all(8),
                    child: OutlinedButton(
                        onPressed: () => controller
                            .toggleFlash()
                            .whenComplete(updateFlashStream),
                        child: StreamBuilder<bool>(
                          stream: flashStreamController.stream,
                          builder: (ctx, snapshot) => Text(
                              snapshot.data == null ? "Blitz aus" : "Blitz an",
                              style: const TextStyle(fontSize: 16)),
                        )),
                  ),
                if (systemFeatures.hasBackCamera &&
                    systemFeatures.hasFrontCamera)
                  Container(
                    margin: const EdgeInsets.all(8),
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
                              style: const TextStyle(fontSize: 16)),
                        )),
                  )
              ]);
        });
  }

  Future<SystemFeatures> _tryToGetSystemFeatures() async {
    for (var i = 0; i < 10; i++) {
      try {
        return await controller.getSystemFeatures();
      } on CameraException {
        await Future.delayed(const Duration(milliseconds: 50));
      }
    }
    return SystemFeatures(true, true, true);
  }
}
