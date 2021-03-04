import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../qr_code_scanner/qr_code_scanner.dart';
import '../verification_card_details_model.dart';
import '../verification_processor.dart';
import 'content_card.dart';
import 'verification_info_text.dart';
import 'verification_result.dart';

class VerificationView extends StatefulWidget {
  const VerificationView({
    Key key,
  }) : super(key: key);

  @override
  State<VerificationView> createState() => _VerificationViewState();
}

class _VerificationViewState extends State<VerificationView> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: Icon(
              Icons.arrow_back_ios,
              color: Theme.of(context).textTheme.bodyText1.color,
            ),
            onPressed: () => Navigator.of(context).pop(),
          ),
          title: Text("Karte verifizieren"),
        ),
        body: SingleChildScrollView(
          child: Column(
            children: <Widget>[
              ContentCard(child: VerificationInfoText()),
              Center(
                child: RaisedButton(
                    padding: EdgeInsets.symmetric(vertical: 12, horizontal: 24),
                    onPressed: _onScanCodePressed,
                    color: Theme.of(context).primaryColor,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(32.0),
                    ),
                    child: Text(
                      "Code einscannen",
                      style: Theme.of(context)
                          .textTheme
                          .headline6
                          .merge(TextStyle(color: Colors.white, fontSize: 20)),
                    )),
              ),
              Consumer<VerificationCardDetailsModel>(
                  builder: (context, verCardDetailsModel, child) {
                return VerificationResult(verCardDetailsModel);
              }),
            ],
          ),
        ));
  }

  void _onScanCodePressed() {
    final provider =
        Provider.of<VerificationCardDetailsModel>(context, listen: false);

    Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => QRCodeScanner(
            qrCodeContentParser:
                VerificationProcessor(provider).processQrCodeContent,
          ),
        ));
  }
}
