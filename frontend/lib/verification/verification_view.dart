import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../identification/base_card_details.dart';
import '../qr_code_scanner/qr_code_scanner.dart';
import 'remote_verification.dart';
import 'verification_card_details_model.dart';
import 'verification_error.dart';
import 'verification_qr_content_parser.dart';

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
              _buildContentCard(child: RichText(text: _buildInfoText())),
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
                return _buildVerificationResult(verCardDetailsModel);
              }),
            ],
          ),
        ));
  }

  Widget _buildVerificationResult(VerificationCardDetailsModel model) {
    switch (model.verificationState) {
      case VerificationState.waitingForScan:
        return Container(width: 0.0, height: 0.0);
      case VerificationState.verificationInProgress:
        verifyCardValidWithRemote(model);
        return _buildWaitingForVerificationResult();
      case VerificationState.verificationSuccess:
        return _buildPositiveVerificationResult(
            model.verificationCardDetails.cardDetails);
      case VerificationState.verificationFailure:
        return _buildNegativeVerificationResult(model.verificationError);
    }
    return Container(width: 0.0, height: 0.0);
  }

  TextSpan _buildInfoText() {
    return TextSpan(style: DefaultTextStyle.of(context).style, children: [
      TextSpan(
          text: "So prüfen Sie die Echtheit einer Ehrenamtskarte:\n\n",
          style: DefaultTextStyle.of(context)
              .style
              .apply(fontSizeFactor: 1.8, fontWeightDelta: 2)),
      TextSpan(
          style: DefaultTextStyle.of(context)
              .style
              .copyWith(height: 1.2)
              .apply(fontSizeFactor: 1.4),
          children: [
            TextSpan(text: "Scannen Sie den QR Code, der auf der "),
            TextSpan(
                text: "„Ausweisen“-Seite ",
                style: TextStyle(fontStyle: FontStyle.italic)),
            TextSpan(text: "Ihres Gegenübers angezeigt wird.\n"),
            TextSpan(
                text: "Daraufhin wird durch eine Server-Anfrage geprüft, "
                    "ob die gescannte Ehrenamtskarte gültig ist.\n"),
            TextSpan(text: "Sie benötigen eine Internetverbindung."),
          ]),
    ]);
  }

  void _onScanCodePressed() {
    final provider =
        Provider.of<VerificationCardDetailsModel>(context, listen: false);

    Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => QRCodeScanner(
            qrCodeContentParser:
                VerificationQrContentParser(provider).processQrCodeContent,
          ),
        ));
  }

  Widget _buildWaitingForVerificationResult() {
    return _buildContentCard(
        child: Column(children: [
          RichText(
              text: TextSpan(
                  style: DefaultTextStyle.of(context)
                      .style
                      .apply(fontSizeFactor: 1.5, fontWeightDelta: 2),
                  children: [
                TextSpan(
                    text:
                        "Bitte warten Sie, während der Code überprüft wird …"),
              ])),
          Center(
            child: CircularProgressIndicator(),
          ),
        ]),
        color: Colors.lime);
  }

  Widget _buildPositiveVerificationResult(BaseCardDetails cardDetails) {
    final dateFormat = DateFormat('dd.MM.yyyy');
    return _buildContentCard(
        child: RichText(
            text: TextSpan(
                style: DefaultTextStyle.of(context)
                    .style
                    .apply(fontSizeFactor: 1.5),
                children: [
          WidgetSpan(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 2.0),
              child: Icon(
                Icons.verified_user,
                color: Colors.green,
                size: 30,
              ),
            ),
          ),
          TextSpan(
              text: "Die Ehrenamtskarte ist gültig\n\n",
              style: DefaultTextStyle.of(context)
                  .style
                  .apply(fontSizeFactor: 1.5, fontWeightDelta: 2)),
          TextSpan(text: "Name: ${cardDetails.fullName}\n"),
          TextSpan(
              text: "Ablaufdatum: "
                  "${dateFormat.format(cardDetails.expirationDate)}\n"),
          TextSpan(text: "Landkreis: ${cardDetails.regionId}"),
        ])));
  }

  Widget _buildNegativeVerificationResult(VerificationError verificationError) {
    return _buildContentCard(
      borderSide: BorderSide(color: Colors.red, width: 4.0),
      child: Column(children: [
        RichText(
            textAlign: TextAlign.center,
            text: TextSpan(
                style: DefaultTextStyle.of(context)
                    .style
                    .apply(fontSizeFactor: 1.3),
                children: [
                  WidgetSpan(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 2.0),
                      child: Icon(
                        Icons.error,
                        color: Colors.red,
                        size: 30,
                      ),
                    ),
                  ),
                  TextSpan(
                      text: "Die Ehrenamtskarte konnte nicht"
                          " validiert werden!\n\n",
                      style: DefaultTextStyle.of(context)
                          .style
                          .apply(fontSizeFactor: 1.5, fontWeightDelta: 2)),
                  verificationError.errorTextSpan,
                  TextSpan(
                      text: "\nFehlercode: ${verificationError.errorCode}"),
                ])),
      ]),
    );
  }

  Card _buildContentCard(
      {Widget child,
      Color color = Colors.white,
      BorderSide borderSide =
          const BorderSide(width: 1.0, color: Colors.black12)}) {
    return Card(
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10.0), side: borderSide),
        margin: EdgeInsets.all(8.0),
        elevation: 5.0,
        color: color,
        child: Padding(
          padding: EdgeInsets.all(8.0),
          child: child,
        ));
  }
}
