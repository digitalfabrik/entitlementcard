import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../qr_code_scanner/qr_code_scanner_page.dart';
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
    final provider = Provider.of<CardDetailsModel>(context, listen: false);

    Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => QRCodeScannerPage(
            title: "Ehrenamtskarte hinzufügen",
            qrCodeContentParser:
                IdentificationQrContentParser(provider).processQrCodeContent,
          ),
        ));
  }
}
