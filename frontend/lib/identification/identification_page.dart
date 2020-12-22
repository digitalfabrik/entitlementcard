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
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Center(
              child: Text(cardDetails == null
                  ? 'Noch keine EAK hinterlegt'
                  : 'EAK von: ${cardDetails.firstName} ${cardDetails.lastName}'
                      '\nAblaufdatum: ${cardDetails.expirationDate.toString()}'),
            ),
            OutlineButton(
              onPressed: () {
                openQRCodeScannerView(context);
              },
              child: Text('Code einscannen'),
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
