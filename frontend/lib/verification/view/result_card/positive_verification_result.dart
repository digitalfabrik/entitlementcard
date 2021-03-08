import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../identification/base_card_details.dart';
import 'verification_result_card.dart';

class PositiveVerificationResult extends StatelessWidget {
  final BaseCardDetails cardDetails;

  PositiveVerificationResult(this.cardDetails);

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
            Text("Ablaufdatum: $expirationDateString"),
            Text("Landkreis: ${cardDetails.regionId}"),
        ]));
  }
}
