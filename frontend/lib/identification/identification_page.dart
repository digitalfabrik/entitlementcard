import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/home/home_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../application/application_form.dart';
import '../routing.dart';
import '../util/non_material_page.dart';
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

    return AnnotatedRegion<SystemUiOverlayStyle>(
        child: Consumer<CardDetailsModel>(
            builder: (context, cardDetailsModel, child) {
          if (!cardDetailsModel.isInitialized) {
            return Container();
          }

          var cardDetails = cardDetailsModel.cardDetails;
          if (cardDetails != null) {
            return CardDetailView(
              cardDetails: cardDetails,
              startActivateEak: () => _showActivateQrCode(context),
              startEakApplication: () => _showEakApplication(context),
              startVerification: () =>
                  _showVerificationDialog(context, settings),
            );
          }

          return NoCardView(
              startVerification: () =>
                  _showVerificationDialog(context, settings),
              startEakApplication: () => _showEakApplication(context),
              startActivateQrCode: () => _showActivateQrCode(context));
        }),
        value: getDefaultOverlayStyle(context));
  }

  void _showVerificationDialog(context, SettingsModel settings) async {
    await VerificationWorkflow.startWorkflow(context, settings);
  }

  void _showActivateQrCode(BuildContext context) {
    Navigator.push(
        context,
        AppRoute(
            builder: (context) => const IdentificationQrScannerPage()));
  }

  void _showEakApplication(BuildContext context) {
    Navigator.push(
        context,
        AppRoute(
            builder: (context) => const ApplicationForm()));
  }
}
