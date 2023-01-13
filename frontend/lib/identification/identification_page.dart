import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/identification/activation/activation_code_scanner_page.dart';
import 'package:ehrenamtskarte/identification/activation_code_model.dart';
import 'package:ehrenamtskarte/identification/card_detail_view/card_detail_view.dart';
import 'package:ehrenamtskarte/identification/no_card_view.dart';
import 'package:ehrenamtskarte/identification/verification/verification_workflow.dart';
import 'package:ehrenamtskarte/routing.dart';
import 'package:flutter/material.dart';
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

  Future<void> _showVerificationDialog(BuildContext context, SettingsModel settings) async {
    await VerificationWorkflow.startWorkflow(context, settings);
  }

  void _startActivation(BuildContext context) {
    Navigator.push(context, AppRoute(builder: (context) => const ActivationCodeScannerPage()));
  }

  Future<bool> _startApplication() {
    return launchUrlString(
      buildConfig.applicationUrl,
      mode: LaunchMode.externalApplication,
    );
  }
}
