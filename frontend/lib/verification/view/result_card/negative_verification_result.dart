import 'package:flutter/material.dart';

import '../../verification_error.dart';
import 'verification_result_card.dart';

class NegativeVerificationResult extends StatelessWidget {
  final VerificationError verificationError;

  NegativeVerificationResult(this.verificationError);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return VerificationResultCard(
      title: "Die Ehrenamtskarte konnte nicht validiert werden.",
      style: VerificationResultCardStyle.negative,
      child: Column(children: [
        Text(verificationError.errorText),
        SizedBox(height: 4),
        Text(
          "Fehlercode: ${verificationError.errorCode}",
          textScaleFactor: 0.5,
          style: TextStyle(color: theme.disabledColor),
        ),
      ]));
  }
}
