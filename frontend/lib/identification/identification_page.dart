import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'card_detail_view.dart';
import 'card_details.dart';
import 'card_details_model.dart';
import 'no_card_view.dart';
import 'scanner/qr_code_scanner.dart';

class IdentificationPage extends StatefulWidget {
  IdentificationPage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _IdentificationPageState createState() => _IdentificationPageState();

  void openQRCodeScannerView(BuildContext context) {
    Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => QRCodeScanner(),
        ));
  }
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
            child: Container(
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
          ));
    });
  }

  void openQRCodeScannerView(BuildContext context) {
    Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => QRCodeScanner(),
        ));
  }
}
