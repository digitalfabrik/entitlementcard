import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class QrCodeScannerControls extends StatelessWidget {
  final MobileScannerController controller;

  const QrCodeScannerControls({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final t = context.t;
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        Container(
          margin: const EdgeInsets.all(8),
          child: OutlinedButton(
            onPressed: () => controller.toggleTorch(),
            child: ValueListenableBuilder<MobileScannerState>(
              valueListenable: controller,
              builder: (context, state, child) {
                final buttonText = state.torchState == TorchState.on
                    ? t.identification.flashOff
                    : t.identification.flashOn;
                return Text(buttonText, style: theme.textTheme.titleSmall?.apply(color: theme.colorScheme.primary));
              },
            ),
          ),
        ),
        Container(
          margin: const EdgeInsets.all(8),
          child: OutlinedButton(
            onPressed: () => controller.switchCamera(),
            child: ValueListenableBuilder<MobileScannerState>(
              valueListenable: controller,
              builder: (context, state, child) {
                final buttonText = state.cameraDirection == CameraFacing.back
                    ? t.identification.selfieCamera
                    : t.identification.standardCamera;
                return Text(buttonText, style: theme.textTheme.titleSmall?.apply(color: theme.colorScheme.primary));
              },
            ),
          ),
        ),
      ],
    );
  }
}
