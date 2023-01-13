import 'dart:developer';

import 'package:ehrenamtskarte/identification/persistence/card_details_store.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter/foundation.dart';

class ActivationCodeModel extends ChangeNotifier {
  DynamicActivationCode? _activationCode;
  bool _isInitialized = false;

  DynamicActivationCode? get activationCode {
    return _activationCode;
  }

  bool get isInitialized {
    return _isInitialized;
  }

  Future<void> initialize() async {
    if (_isInitialized) {
      return;
    }
    try {
      _activationCode = await const ActivationCodeStore().load();
    } on Exception catch (e) {
      log("Failed to initialize activation code from secure storage.", error: e);
    } finally {
      _isInitialized = true;
      notifyListeners();
    }
  }

  void setCode(DynamicActivationCode code) {
    const ActivationCodeStore().store(code);
    _activationCode = code;
    notifyListeners();
  }

  void removeCode() {
    const ActivationCodeStore().remove();
    notifyListeners();
  }
}
