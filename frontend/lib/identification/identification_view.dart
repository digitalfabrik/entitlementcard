import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../verification/verification_workflow.dart';
import 'card_detail_view.dart';
import 'card_details.dart';
import 'card_details_model.dart';
import 'identification_qr_scanner_page.dart';
import 'no_card_view.dart';
import 'testing_data_item.dart';

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
      _cardDetails = cardDetailsModel.cardDetails;
      return Scaffold(
          body: SingleChildScrollView(
              child: SafeArea(
                  child: Column(children: [
        Container(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          child: _cardDetails == null
              ? NoCardView(
                  startVerification: () => _showVerificationDialog(context),
                  startActivateQrCode: () => _showActivateQrCode(context))
              : CardDetailView(
                  cardDetails: _cardDetails,
                  openQrScanner: () => _showActivateQrCode(context),
                  startVerification: () => _showVerificationDialog(context),
                ),
        ),
        if (showTestDataOptions) TestingDataItem(),
      ]))));
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
