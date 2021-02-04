import 'package:flutter/foundation.dart';

import 'verification_card_details.dart';
import 'verification_error.dart';

enum LocalVerificationState {
  waitingForScan,
  failure,
  readyForRemoteVerification,
}

class VerificationCardDetailsModel extends ChangeNotifier {
  VerificationCardDetails _verificationCardDetails;
  LocalVerificationState _verificationState =
      LocalVerificationState.waitingForScan;
  VerificationError _verificationError;
  String _verificationHash;

  LocalVerificationState get verificationState {
    return _verificationState;
  }

  VerificationCardDetails get verificationCardDetails {
    return _verificationCardDetails;
  }

  VerificationError get verificationError {
    return _verificationError;
  }

  String get verificationHash {
    return _verificationHash;
  }

  void setWaitingForScan() {
    _verificationState = LocalVerificationState.waitingForScan;
    notifyListeners();
  }

  void setReadyForRemoteVerification(
      VerificationCardDetails details, String verificationHash) {
    _verificationState = LocalVerificationState.readyForRemoteVerification;
    _verificationCardDetails = details;
    _verificationHash = verificationHash;
    notifyListeners();
  }

  void setVerificationFailure(VerificationError verificationError) {
    _verificationState = LocalVerificationState.failure;
    _verificationError = verificationError;
    notifyListeners();
  }
}
