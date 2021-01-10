import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_svg/svg.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';

import 'card_details.dart';
import 'card_details_model.dart';
import 'id_card.dart';

class CardDetailView extends StatelessWidget {
  final CardDetails cardDetails;
  final VoidCallback onOpenQrScanner;

  const CardDetailView({Key key, this.cardDetails, this.onOpenQrScanner})
      : super(key: key);

  get _formattedExpirationDate =>
      DateFormat('dd.MM.yyyy').format(cardDetails.expirationDate);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        InkWell(
            onTap: () => showDialog(context: context, builder: _createQrCode),
            child: IdCard(
                child: SvgPicture.asset("assets/card.svg",
                    semanticsLabel: 'Ehrenamtskarte',
                    alignment: Alignment.center,
                    fit: BoxFit.fill))),
        SizedBox(height: 10),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 4),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Container(
                alignment: Alignment.centerRight,
                child: InkWell(
                    child: Text(
                      "Code einscannen",
                      style: TextStyle(color: Theme.of(context).accentColor),
                    ),
                    onTap: onOpenQrScanner),
              ),
              SizedBox(height: 10),
              Text("Gültig bis $_formattedExpirationDate"),
              SizedBox(height: 5),
              Text(
                "${cardDetails.firstName} ${cardDetails.lastName}",
                style: Theme.of(context).textTheme.headline6,
              ),
            ],
          ),
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
              data: cardDetailsModel.cardDetails.toString(),
              version: QrVersions.auto,
              padding: const EdgeInsets.all(24.0)));
    });
  }
}
