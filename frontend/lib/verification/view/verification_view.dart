import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../qr_code_scanner/qr_code_scanner.dart';
import '../remote_verification.dart';
import '../scanner/verification_qr_content_parser.dart';
import '../verification_card_details_model.dart';
import 'content_card.dart';
import 'negative_verification_result.dart';
import 'positive_verification_result.dart';
import 'verification_info_text.dart';
import 'waiting_for_verification.dart';

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
        return WaitingForVerification();
      case VerificationState.verificationSuccess:
        return PositiveVerificationResult(
            model.verificationCardDetails.cardDetails);
      case VerificationState.verificationFailure:
        return NegativeVerificationResult(model.verificationError);
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
}
