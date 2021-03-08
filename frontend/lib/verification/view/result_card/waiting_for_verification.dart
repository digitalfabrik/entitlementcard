import 'package:flutter/material.dart';

import 'verification_result_card.dart';

class WaitingForVerification extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return VerificationResultCard(
      style: VerificationResultCardStyle.neutral,
      title: "Bitte warten Sie …",
      child: Column(children: [
        Text("Wir überprüfen den gescannten Code für Sie."),
        SizedBox(height: 12),
        CircularProgressIndicator()
      ]),
    );
  }
}
