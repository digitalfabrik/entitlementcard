import 'package:flutter/material.dart';

import '../verification_error.dart';
import 'verification_result_card.dart';

class NegativeVerificationResult extends StatelessWidget {
  final VerificationError verificationError;

  NegativeVerificationResult(this.verificationError);

  @override
  Widget build(BuildContext context) {
    return VerificationResultCard(
      title: "Die Ehrenamtskarte konnte nicht validiert werden!",
      isPositive: false,
      child: Column(children: [
        Text(verificationError.errorText),
        Text("Fehlercode: ${verificationError.errorCode}"),
      ]));
  }
}
