import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_svg/svg.dart';
import 'package:intl/intl.dart';
import 'package:otp/otp.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';

import '../verification/verification_card_details.dart';
import '../verification/verification_encoder.dart';
import 'card_details.dart';
import 'card_details_model.dart';
import 'id_card.dart';
import 'otp_generator.dart';

class CardDetailView extends StatelessWidget {
  final CardDetails cardDetails;
  final VoidCallback onOpenQrScanner;
  final OTPGenerator _otpGenerator;

  CardDetailView({Key key, this.cardDetails, this.onOpenQrScanner})
      : _otpGenerator = OTPGenerator(
            cardDetails.base32TotpSecret, 60 * 5, 10, Algorithm.SHA256),
        super(key: key);

  get _formattedExpirationDate =>
      DateFormat('dd.MM.yyyy').format(cardDetails.expirationDate);

  @override
  Widget build(BuildContext context) {
    var isLandscape = MediaQuery.of(context).size.width >= 500;

    return Flex(
      direction: isLandscape ? Axis.horizontal : Axis.vertical,
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      mainAxisSize: MainAxisSize.min,
      children: [
        Column(
          crossAxisAlignment: isLandscape
              ? CrossAxisAlignment.start
              : CrossAxisAlignment.stretch,
          children: [
            IdCard(
              height: isLandscape ? 200 : null,
              child: SvgPicture.asset("assets/card.svg",
                  semanticsLabel: 'Ehrenamtskarte',
                  alignment: Alignment.center,
                  fit: BoxFit.contain),
            ),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 4),
              alignment: Alignment.centerRight,
              child: InkWell(
                  child: Text(
                    "Code neu einscannen",
                    style: TextStyle(color: Theme.of(context).accentColor),
                  ),
                  onTap: onOpenQrScanner),
            ),
          ],
        ),
        SizedBox(height: 15, width: 15),
        Flexible(
          fit: FlexFit.loose,
          child: Padding(
              padding: EdgeInsets.all(4),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    cardDetails.fullName ?? "",
                    style: Theme.of(context).textTheme.headline6,
                  ),
                  SizedBox(height: 5),
                  Text("Gültig bis $_formattedExpirationDate"),
                  SizedBox(
                    height: 24,
                  ),
                  Center(
                      child: MaterialButton(
                    onPressed: () {
                      showDialog(context: context, builder: _createQrCode);
                    },
                    color: Colors.white,
                    textColor: Colors.black,
                    child: Icon(
                      Icons.qr_code,
                      size: 50,
                    ),
                    padding: EdgeInsets.all(16),
                    shape: CircleBorder(),
                  )),
                ],
              )),
        )
      ],
    );
  }

  Widget _createQrCode(BuildContext context) {
    return Consumer<CardDetailsModel>(
        builder: (context, cardDetailsModel, child) {
      return Dialog(
          insetPadding: EdgeInsets.all(16),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
          //this right here
          child: QrImage(
              data: encodeVerificationCardDetails(
                  VerificationCardDetails(cardDetails, _generateOTP())),
              version: QrVersions.auto,
              padding: const EdgeInsets.all(24.0)));
    });
  }

  int _generateOTP() {
    return _otpGenerator.generateOTP();
  }
}
