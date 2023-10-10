import 'dart:developer';

import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/identification/user_code_store.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter/foundation.dart';

class UserCodeModel extends ChangeNotifier {
  List<DynamicUserCode> _userCodes = [];
  bool _isInitialized = false;

  List<DynamicUserCode> get userCodes {
    return _userCodes;
  }

  bool get isInitialized {
    return _isInitialized;
  }

  Future<void> initialize() async {
    if (_isInitialized) {
      return;
    }
    try {
      await UserCodeStore().importLegacyCard();
      _userCodes = await const UserCodeStore().load();
    } on Exception catch (e) {
      log('Failed to initialize activation code from secure storage.', error: e);
    } finally {
      _isInitialized = true;
      notifyListeners();
    }
  }

  void insertCode(DynamicUserCode code) {
    List<DynamicUserCode> userCodes = _userCodes;
    if (isAlreadyInList(userCodes, code)) return;
    userCodes.add(code);
    const UserCodeStore().store(userCodes);
    _userCodes = userCodes;
    notifyListeners();
  }

  void updateCode(DynamicUserCode code) {
    List<DynamicUserCode> userCodes = _userCodes;
    if (isAlreadyInList(userCodes, code)) {
      userCodes = updateUserCode(userCodes, code);
      const UserCodeStore().store(userCodes);
      _userCodes = userCodes;
      notifyListeners();
    }
  }

  void removeCode(DynamicUserCode code) {
    List<DynamicUserCode> userCodes = _userCodes;
    userCodes.remove(code);
    const UserCodeStore().store(userCodes);
    _userCodes = userCodes;
    notifyListeners();
  }

  void removeCodes() {
    const UserCodeStore().remove();
    _userCodes = [];
    notifyListeners();
  }

  List<DynamicUserCode> updateUserCode(List<DynamicUserCode> userCodes, DynamicUserCode userCode) {
    userCodes[userCodes.indexWhere((code) => code.info == userCode.info)] = userCode;
    return userCodes;
  }
}

bool isAlreadyInList(List<DynamicUserCode> userCodes, DynamicUserCode code) {
  return userCodes.map((userCode) => userCode.info).contains(code.info);
}

bool hasReachedCardLimit(List<DynamicUserCode> userCodes) {
  return userCodes.length >= buildConfig.maxCardAmount;
}
