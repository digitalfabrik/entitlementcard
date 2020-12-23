import 'card_details_model.dart';
import 'package:provider/provider.dart';

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
          body: Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Center(
                child: Text(_cardDetails == null
                    ? 'Noch keine EAK hinterlegt'
                    : 'EAK von: ${_cardDetails.firstName} ${_cardDetails.lastName}'
                        '\nAblaufdatum: ${_cardDetails.expirationDate.toString()}'),
              ),
              OutlineButton(
                onPressed: () {
                  openQRCodeScannerView(context);
                },
                child: Text('Code einscannen'),
              ),
            ],
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
