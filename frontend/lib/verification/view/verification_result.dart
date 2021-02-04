import 'package:flutter/material.dart';

import '../verification_card_details_model.dart';
import 'negative_verification_result.dart';
import 'positive_verification_result.dart';
import 'waiting_for_verification.dart';

class VerificationResult extends StatelessWidget {
  final VerificationCardDetailsModel model;

  VerificationResult(this.model);

  @override
  Widget build(BuildContext context) {
    switch (model.verificationState) {
      case VerificationState.waitingForScan:
        return Container(width: 0.0, height: 0.0);
      case VerificationState.verificationInProgress:
        return WaitingForVerification();
      case VerificationState.verificationSuccess:
        return PositiveVerificationResult(
            model.verificationCardDetails.cardDetails);
      case VerificationState.verificationFailure:
        return NegativeVerificationResult(model.verificationError);
    }
    return Container(width: 0.0, height: 0.0);
  }
}
