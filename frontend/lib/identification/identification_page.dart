import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../application/application_form.dart';
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
              startVerification: () => _showVerificationDialog(context),
            );
          }

          return Scaffold(
            body: NoCardView(
                startVerification: () => _showVerificationDialog(context),
                startEakApplication: () => _showEakApplication(context),
                startActivateQrCode: () => _showActivateQrCode(context)),
          );
        }),
        value: getDefaultOverlayStyle(context));
  }

  void _showVerificationDialog(context) async {
    await VerificationWorkflow.startWorkflow(context);
  }

  void _showActivateQrCode(BuildContext context) {
    Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => const IdentificationQrScannerPage()));
  }

  void _showEakApplication(BuildContext context) {
    Navigator.push(context,
        MaterialPageRoute(builder: (context) => const ApplicationForm()));
  }
}
