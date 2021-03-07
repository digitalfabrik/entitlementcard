import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../graphql/graphql_api.dart';
import '../../identification/base_card_details.dart';
import 'content_card.dart';

class PositiveVerificationResult extends StatelessWidget {
  final BaseCardDetails cardDetails;
  final GetRegions$Query$Region region;

  PositiveVerificationResult(this.cardDetails, this.region);

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('dd.MM.yyyy');
    var expirationDateString;
    if (cardDetails.expirationDate == null) {
      expirationDateString = "unbegrenzt";
    } else {
      expirationDateString = dateFormat.format(cardDetails.expirationDate);
    }
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
          TextSpan(text: "Ablaufdatum: $expirationDateString\n"),
          TextSpan(text: "Ausgestellt von: ${region.prefix} ${region.name}"),
        ])));
  }
}
