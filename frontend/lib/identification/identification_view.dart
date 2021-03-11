import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../verification/verification_page.dart';
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
          appBar: AppBar(
            title: Text('Digitale Ehrenamtskarte'),
          ),
          body: SingleChildScrollView(
              child: Column(
            children: [
              Container(
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                child: _cardDetails == null
                    ? NoCardView(
                        onOpenQrScanner: () => openQRCodeScannerView(context),
                      )
                    : CardDetailView(
                        cardDetails: _cardDetails,
                        onOpenQrScanner: () => openQRCodeScannerView(context),
                      ),
              ),
              Center(
                child: ElevatedButton(
                    onPressed: () => _showVerificationPage(context),
                    style: ElevatedButton.styleFrom(
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(32.0)),
                      padding:
                          EdgeInsets.symmetric(vertical: 12, horizontal: 24),
                    ),
                    child: Text(
                      "Karte verifizieren",
                      style: Theme.of(context)
                          .textTheme
                          .headline6
                          .merge(TextStyle(color: Colors.white, fontSize: 20)),
                    )),
              ),
              if (showTestDataOptions) TestingDataItem(),
            ],
          )));
    });
  }

  void _showVerificationPage(context) {
    Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => VerificationPage(),
        ));
  }

  void openQRCodeScannerView(BuildContext context) {
    Navigator.push(context,
        MaterialPageRoute(builder: (context) => IdentificationQrScannerPage()));
  }
}
