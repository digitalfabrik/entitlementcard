import 'dart:developer';

import 'package:ehrenamtskarte/identification/user_codes_store.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter/foundation.dart';

class UserCodesModel extends ChangeNotifier {
  List<DynamicUserCode>? _userCodes = [];
  bool _isInitialized = false;

  List<DynamicUserCode>? get userCodes {
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
      _userCodes = await const UserCodesStore().load();
    } on Exception catch (e) {
      log('Failed to initialize activation code from secure storage of codes.', error: e);
    } finally {
      _isInitialized = true;
      notifyListeners();
    }
  }

  void setCode(DynamicUserCode code) {
    List<DynamicUserCode> userCodes = _userCodes!;
    if (UserCodesModel().isAlreadyInList(userCodes, code)) return;
    userCodes.add(code);
    const UserCodesStore().store(userCodes);
    _userCodes = userCodes;
    notifyListeners();
  }

  //
  bool isAlreadyInList(List<DynamicUserCode> userCodes, DynamicUserCode code) {
    return userCodes.map((userCode) => userCode.info).contains(code.info);
  }

  void removeCode(DynamicUserCode code) {
    List<DynamicUserCode> userCodes = _userCodes!;
    userCodes.remove(code);
    const UserCodesStore().store(userCodes);
    _userCodes = userCodes;
    notifyListeners();
  }

  void removeCodes() {
    const UserCodesStore().remove();
    _userCodes = [];
    notifyListeners();
  }
}
