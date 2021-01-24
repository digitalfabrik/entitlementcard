import 'package:flutter/foundation.dart';

import 'verification_card_details.dart';
import 'verification_error.dart';

enum VerificationState {
  waitingForScan,
  verificationInProgress,
  verificationSuccess,
  verificationFailure
}

class VerificationCardDetailsModel extends ChangeNotifier {
  VerificationCardDetails _verificationCardDetails;
  VerificationState _verificationState = VerificationState.waitingForScan;
  VerificationError _verificationError;

  VerificationState get verificationState {
    return _verificationState;
  }

  VerificationCardDetails get verificationCardDetails {
    return _verificationCardDetails;
  }

  VerificationError get verificationError {
    return _verificationError;
  }

  void setWaitingForScan() {
    _verificationState = VerificationState.waitingForScan;
    notifyListeners();
  }

  void setWaitingForVerificationResult() {
    _verificationState = VerificationState.waitingForScan;
    notifyListeners();
  }

  void setVerificationFailure(VerificationError verificationError) {
    _verificationState = VerificationState.verificationFailure;
    _verificationError = verificationError;
    notifyListeners();
  }

  void setVerificationSuccessful(VerificationCardDetails details) {
    _verificationState = VerificationState.verificationSuccess;
    _verificationCardDetails = details;
    notifyListeners();
  }
}
