import 'package:ehrenamtskarte/identification/card_details.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:intl/intl.dart';

import 'id_card.dart';

class CardDetailView extends StatelessWidget {
  final CardDetails cardDetails;
  final VoidCallback onOpenQrScanner;

  const CardDetailView({Key key, this.cardDetails, this.onOpenQrScanner})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        IdCard(
            child: SvgPicture.asset("assets/card.svg",
                semanticsLabel: 'Ehrenamtskarte',
                alignment: Alignment.center,
                fit: BoxFit.fill)),
        SizedBox(height: 10),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 4),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              InkWell(
                  child: Text(
                    "Code einscannen",
                    style: TextStyle(color: Theme.of(context).accentColor),
                    textAlign: TextAlign.end,
                  ),
                  onTap: onOpenQrScanner),
              SizedBox(height: 5),
              Text(
                  "Gültig bis ${DateFormat('dd.MM.yyyy').format(cardDetails.expirationDate)}"),
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
}
