import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../identification/base_card_details.dart';
import '../../qr_code_scanner/qr_code_scanner.dart';
import '../remote_verification.dart';
import '../scanner/verification_qr_content_parser.dart';
import '../verification_card_details_model.dart';
import '../verification_error.dart';
import 'content_card.dart';
import 'verification_info_text.dart';

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
    return ContentCard(
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
    return ContentCard(
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
    return ContentCard(
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
}
