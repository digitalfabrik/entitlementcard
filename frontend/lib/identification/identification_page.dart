import 'package:ehrenamtskarte/identification/no_card_view.dart';

import 'card_detail_view.dart';
import 'card_details.dart';
import 'qr_code_scanner.dart';
import 'package:flutter/material.dart';

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
  CardDetails cardDetails;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('Digitale Ehrenamtskarte'),
        ),
        // body is the majority of the screen.
        body: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Container(
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 32),
              child: cardDetails == null
                  ? NoCardView(
                      onOpenQrScanner: () => openQRCodeScannerView(context),
                    )
                  : CardDetailView(
                      cardDetails: cardDetails,
                      onOpenQrScanner: () => openQRCodeScannerView(context),
                    ),
            ),
          ],
        ));
  }

  void openQRCodeScannerView(BuildContext context) {
    var result = Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => QRCodeScanner(),
        ));
    result.then((value) => setState(() => this.cardDetails = value));
  }
}
