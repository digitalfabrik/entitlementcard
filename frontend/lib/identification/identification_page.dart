import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activation_code_scanner_page.dart';
import 'package:ehrenamtskarte/identification/card_detail_view/card_detail_view.dart';
import 'package:ehrenamtskarte/identification/no_card_view.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_camera_permission_dialog.dart';
import 'package:ehrenamtskarte/identification/user_code_model.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/verification_workflow.dart';
import 'package:ehrenamtskarte/routing.dart';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher_string.dart';

class IdentificationPage extends StatelessWidget {
  const IdentificationPage({super.key});

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsModel>(context);

    return Consumer<UserCodeModel>(
      builder: (context, userCodeModel, child) {
        if (!userCodeModel.isInitialized) {
          return Container();
        }

        final userCode = userCodeModel.userCode;
        if (userCode != null) {
          return CardDetailView(
            userCode: userCode,
            startVerification: () => _showVerificationDialog(context, settings),
            startActivation: () => _startActivation(context),
            startApplication: _startApplication,
          );
        }

        return NoCardView(
          startVerification: () => _showVerificationDialog(context, settings),
          startActivation: () => _startActivation(context),
          startApplication: _startApplication,
        );
      },
    );
  }

  Future<void> handleDeniedCameraPermission(BuildContext context) async {
    await QrCodeCameraPermissionDialog.showPermissionDialog(context);
  }

  Future<void> _showVerificationDialog(BuildContext context, SettingsModel settings) async {
    if (await Permission.camera.request().isGranted) {
      await VerificationWorkflow.startWorkflow(context, settings);
      return;
    }
    handleDeniedCameraPermission(context);
  }

  Future<void> _startActivation(BuildContext context) async {
    if (await Permission.camera.request().isGranted) {
      Navigator.push(context, AppRoute(builder: (context) => const ActivationCodeScannerPage()));
      return;
    }
    handleDeniedCameraPermission(context);
  }

  Future<bool> _startApplication() {
    return launchUrlString(
      buildConfig.applicationUrl,
      mode: LaunchMode.externalApplication,
    );
  }
}
