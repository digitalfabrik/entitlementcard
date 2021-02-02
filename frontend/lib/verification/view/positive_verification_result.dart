import 'package:ehrenamtskarte/identification/base_card_details.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import 'content_card.dart';

class PositiveVerificationResult extends StatelessWidget {
  final BaseCardDetails cardDetails;

  PositiveVerificationResult(this.cardDetails);

  @override
  Widget build(BuildContext context) {
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
}
