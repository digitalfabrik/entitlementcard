import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../graphql/graphql_api.dart';
import '../../../identification/base_card_details.dart';
import 'verification_result_card.dart';

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
    return VerificationResultCard(
        title: "Die Ehrenamtskarte ist gültig.",
        style: VerificationResultCardStyle.positive,
        child: Column(
          children: [
            Text("Name: ${cardDetails.fullName}"),
            Text("Gültig bis: $expirationDateString"),
            if (region != null)
              Text("Ausgestellt von: ${region.prefix} ${region.name}"),
        ]));
  }
}
