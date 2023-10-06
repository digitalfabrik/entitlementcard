import 'dart:developer';

import 'package:ehrenamtskarte/identification/user_code_store.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter/foundation.dart';

// TODO remove this file
@Deprecated('is needed to load old card data to new structure')
class UserCodeModel extends ChangeNotifier {
  DynamicUserCode? _userCode;
  bool _isInitialized = false;

  DynamicUserCode? get userCode {
    return _userCode;
  }

  bool get isInitialized {
    return _isInitialized;
  }

  Future<void> initialize() async {
    if (_isInitialized) {
      return;
    }
    try {
      _userCode = await const UserCodeStore().load();
    } on Exception catch (e) {
      log('Failed to initialize activation code from secure storage.', error: e);
    } finally {
      _isInitialized = true;
      notifyListeners();
    }
  }

  void setCode(DynamicUserCode code) {
    const UserCodeStore().store(code);
    _userCode = code;
    notifyListeners();
  }

  void removeCode() {
    const UserCodeStore().remove();
    _userCode = null;
    notifyListeners();
  }
}
