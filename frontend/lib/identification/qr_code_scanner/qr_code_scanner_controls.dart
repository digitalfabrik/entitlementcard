import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

import '../../util/i18n.dart';

class QrCodeScannerControls extends StatelessWidget {
  final MobileScannerController controller;

  const QrCodeScannerControls({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        Container(
          margin: const EdgeInsets.all(8),
          child: OutlinedButton(
            onPressed: () => controller.toggleTorch(),
            child: ValueListenableBuilder(
              valueListenable: controller.torchState,
              builder: (ctx, state, child) => Text(
                state == TorchState.on ? t(context).identification_flashOff : t(context).identification_flashOn,
                style: const TextStyle(fontSize: 16),
              ),
            ),
          ),
        ),
        Container(
          margin: const EdgeInsets.all(8),
          child: OutlinedButton(
            onPressed: () => controller.switchCamera(),
            child: ValueListenableBuilder(
              valueListenable: controller.cameraFacingState,
              builder: (ctx, state, child) => Text(
                state == CameraFacing.back ? t(context).identification_selfieCamera : t(context).identification_standardCamera,
                style: const TextStyle(fontSize: 16),
              ),
            ),
          ),
        )
      ],
    );
  }
}
