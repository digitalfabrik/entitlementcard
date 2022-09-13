import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/identification/card_detail_view/card_detail_view.dart';
import 'package:ehrenamtskarte/identification/card_details_model.dart';
import 'package:ehrenamtskarte/identification/identification_qr_scanner_page.dart';
import 'package:ehrenamtskarte/identification/no_card_view.dart';
import 'package:ehrenamtskarte/routing.dart';
import 'package:ehrenamtskarte/verification/verification_workflow.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class IdentificationPage extends StatelessWidget {
  final String title;

  const IdentificationPage({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsModel>(context);

    return Consumer<CardDetailsModel>(
      builder: (context, cardDetailsModel, child) {
        if (!cardDetailsModel.isInitialized) {
          return Container();
        }

        final cardDetails = cardDetailsModel.cardDetails;
        if (cardDetails != null) {
          return CardDetailView(
            cardDetails: cardDetails,
            startActivateEak: () => _showActivateQrCode(context),
            startEakApplication: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  behavior: SnackBarBehavior.floating,
                  content: Text('Not yet implemented.'),
                ),
              );
            },
            startVerification: () => _showVerificationDialog(context, settings),
          );
        }

        return NoCardView(
          startVerification: () => _showVerificationDialog(context, settings),
          startActivateQrCode: () => _showActivateQrCode(context),
          startEakApplication: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                behavior: SnackBarBehavior.floating,
                content: Text('Not yet implemented.'),
              ),
            );
          },
        );
      },
    );
  }

  Future<void> _showVerificationDialog(BuildContext context, SettingsModel settings) async {
    await VerificationWorkflow.startWorkflow(context, settings);
  }

  void _showActivateQrCode(BuildContext context) {
    Navigator.push(context, AppRoute(builder: (context) => const IdentificationQrScannerPage()));
  }
}
