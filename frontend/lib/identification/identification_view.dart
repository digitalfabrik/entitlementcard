import 'package:ehrenamtskarte/verification/verification_page.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../qr_code_scanner/qr_code_scanner.dart';
import 'card_detail_view.dart';
import 'card_details.dart';
import 'card_details_model.dart';
import 'identification_qr_content_parser.dart';
import 'no_card_view.dart';

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
              Center(
                child: RaisedButton(
                    padding: EdgeInsets.symmetric(vertical: 12, horizontal: 24),
                    onPressed: () => _showVerificationPage(context),
                    color: Theme.of(context).primaryColor,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(32.0),
                    ),
                    child: Text(
                      "Karte verifizieren",
                      style: Theme.of(context)
                          .textTheme
                          .headline6
                          .merge(TextStyle(color: Colors.white, fontSize: 20)),
                    )),
              ),
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
              )
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
    final provider = Provider.of<CardDetailsModel>(context, listen: false);

    Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => QRCodeScanner(
            qrCodeContentParser:
                IdentificationQrContentParser(provider).processQrCodeContent,
          ),
        ));
  }
}
