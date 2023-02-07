import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/identification/activation_code_model.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activation_code_scanner_page.dart';
import 'package:ehrenamtskarte/identification/card_detail_view/card_detail_view.dart';
import 'package:ehrenamtskarte/identification/no_card_view.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_camera_permission_dialog.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/verification_workflow.dart';
import 'package:ehrenamtskarte/routing.dart';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher_string.dart';

class IdentificationPage extends StatelessWidget {
  final String title;

  const IdentificationPage({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsModel>(context);

    return Consumer<ActivationCodeModel>(
      builder: (context, activationCodeModel, child) {
        if (!activationCodeModel.isInitialized) {
          return Container();
        }

        final activationCode = activationCodeModel.activationCode;
        if (activationCode != null) {
          return CardDetailView(
            activationCode: activationCode,
            startVerification: () => _showVerificationDialog(context, settings),
            startActivation: () => _startActivation(context, settings),
            startApplication: _startApplication,
          );
        }

        return NoCardView(
          startVerification: () => _showVerificationDialog(context, settings),
          startActivation: () => _startActivation(context, settings),
          startApplication: _startApplication,
        );
      },
    );
  }

  Future<void> checkCameraPermission(BuildContext context, SettingsModel settings) async {
    Future<void> showDialog() async => QrCodeCameraPermissionDialog.showPermissionDialog(context);
    // ios & android set different status when access was denied
    final bool permissionsDenied =
        await Permission.camera.status.isPermanentlyDenied || await Permission.camera.status.isDenied;
    if (permissionsDenied && settings.cameraPermissionRequested) {
      await showDialog();
      return;
    }
    await settings.setCameraPermissionRequested(requested: true);
  }

  Future<void> _showVerificationDialog(BuildContext context, SettingsModel settings) async {
    if (await Permission.camera.request().isGranted) {
      await VerificationWorkflow.startWorkflow(context, settings);
      return;
    }
    checkCameraPermission(context, settings);
  }

  Future<void> _startActivation(BuildContext context, SettingsModel settings) async {
    if (await Permission.camera.request().isGranted) {
      Navigator.push(context, AppRoute(builder: (context) => const ActivationCodeScannerPage()));
      return;
    }
    checkCameraPermission(context, settings);
  }

  Future<bool> _startApplication() {
    return launchUrlString(
      buildConfig.applicationUrl,
      mode: LaunchMode.externalApplication,
    );
  }
}
