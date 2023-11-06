import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

import 'package:ehrenamtskarte/util/l10n.dart';

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
                state == TorchState.on ? context.l10n.identification_flashOff : context.l10n.identification_flashOn,
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
                state == CameraFacing.back
                    ? context.l10n.identification_selfieCamera
                    : context.l10n.identification_standardCamera,
                style: const TextStyle(fontSize: 16),
              ),
            ),
          ),
        )
      ],
    );
  }
}
