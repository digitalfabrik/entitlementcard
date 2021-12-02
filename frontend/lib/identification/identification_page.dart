import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../routing.dart';
import '../verification/verification_workflow.dart';
import 'card_detail_view/card_detail_view.dart';
import 'card_details_model.dart';
import 'identification_qr_scanner_page.dart';
import 'no_card_view.dart';

class IdentificationPage extends StatelessWidget {
  final String title;

  const IdentificationPage({Key? key, required this.title}) : super(key: key);

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

  void _showVerificationDialog(BuildContext context, SettingsModel settings) async {
    await VerificationWorkflow.startWorkflow(context, settings);
  }

  void _showActivateQrCode(BuildContext context) {
    Navigator.push(context, AppRoute(builder: (context) => const IdentificationQrScannerPage()));
  }
}
