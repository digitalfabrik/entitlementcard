import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../verification/verification_workflow.dart';
import 'card_detail_view/card_detail_view.dart';
import 'card_details.dart';
import 'card_details_model.dart';
import 'identification_qr_scanner_page.dart';
import 'no_card_view.dart';

const showTestDataOptions =
bool.fromEnvironment("test_data_options", defaultValue: false);

class IdentificationPage extends StatefulWidget {
  IdentificationPage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _IdentificationPageState createState() => _IdentificationPageState();
}

class _IdentificationPageState extends State<IdentificationPage> {
  CardDetails _cardDetails;

  @override
  Widget build(BuildContext context) {
    return Consumer<CardDetailsModel>(
        builder: (context, cardDetailsModel, child) {
          if (!cardDetailsModel.isInitialized) {
            return Container();
          }

          _cardDetails = cardDetailsModel.cardDetails;
          if (_cardDetails != null) {
            return CardDetailView(
                cardDetails: _cardDetails,
                startActivateEak: () => _showActivateQrCode(context),
                startVerification: () => _showVerificationDialog(context));
          }

          return Scaffold(
            body: NoCardView(
                startVerification: () => _showVerificationDialog(context),
                startActivateQrCode: () => _showActivateQrCode(context)),
          );
        });
  }

  void _showVerificationDialog(context) async {
    await VerificationWorkflow.startWorkflow(context);
  }

  void _showActivateQrCode(BuildContext context) {
    Navigator.push(context,
        MaterialPageRoute(builder: (context) => IdentificationQrScannerPage()));
  }
}
