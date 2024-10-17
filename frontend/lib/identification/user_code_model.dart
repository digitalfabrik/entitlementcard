import 'dart:collection';

import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/identification/user_code_store.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter/foundation.dart';

import 'package:ehrenamtskarte/sentry.dart';

enum _InitializationState { uninitialized, initializing, failed, initialized }

class UserCodeModel extends ChangeNotifier {
  List<DynamicUserCode> _userCodes = [];
  _InitializationState _initState = _InitializationState.uninitialized;

  bool get isInitialized {
    return _initState == _InitializationState.initialized;
  }

  bool get initializationFailed {
    return _initState == _InitializationState.failed;
  }

  void _requireInitialized() {
    if (!isInitialized) {
      throw StateError('UserCodeModel not initialized!');
    }
  }

  List<DynamicUserCode> get userCodes {
    _requireInitialized();
    return UnmodifiableListView(_userCodes);
  }

  Future<void> initialize() async {
    if (_initState == _InitializationState.initializing || _initState == _InitializationState.initialized) {
      return;
    }
    _initState = _InitializationState.initializing;
    const store = UserCodeStore();
    try {
      DynamicUserCode? legacyCode = await store.loadAndDeleteLegacyCard();
      var userCodes = await store.load();
      if (legacyCode != null && !isAlreadyInList(userCodes, legacyCode.info)) {
        userCodes.add(legacyCode);
        await store.store(userCodes);
      }
      _userCodes = userCodes;
      _initState = _InitializationState.initialized;
    } catch (e, stackTrace) {
      reportError('Failed to initialize activation code from secure storage: $e', stackTrace);
      _initState = _InitializationState.failed;
    } finally {
      notifyListeners();
    }
  }

  void insertCode(DynamicUserCode code) {
    _requireInitialized();
    List<DynamicUserCode> userCodes = _userCodes;
    if (isAlreadyInList(userCodes, code.info)) return;
    userCodes.add(code);
    const UserCodeStore().store(userCodes);
    _userCodes = userCodes;
    notifyListeners();
  }

  void updateCode(DynamicUserCode code) {
    _requireInitialized();
    List<DynamicUserCode> userCodes = _userCodes;
    if (isAlreadyInList(userCodes, code.info)) {
      userCodes = _updateUserCode(userCodes, code);
      const UserCodeStore().store(userCodes);
      _userCodes = userCodes;
      notifyListeners();
    }
  }

  void removeCode(DynamicUserCode code) {
    _requireInitialized();
    List<DynamicUserCode> userCodes = _userCodes;
    userCodes.remove(code);
    const UserCodeStore().store(userCodes);
    _userCodes = userCodes;
    notifyListeners();
  }

  Future<void> removeCodes() async {
    _requireInitialized();
    await const UserCodeStore().remove();
    _userCodes = [];
    notifyListeners();
  }
}

List<DynamicUserCode> _updateUserCode(List<DynamicUserCode> userCodes, DynamicUserCode userCode) {
  userCodes[userCodes.indexWhere((code) => code.info == userCode.info)] = userCode;
  return userCodes;
}

bool isAlreadyInList(List<DynamicUserCode> userCodes, CardInfo info) {
  return userCodes.map((userCode) => userCode.info).contains(info);
}

bool hasReachedCardLimit(List<DynamicUserCode> userCodes) {
  return userCodes.length >= buildConfig.maxCardAmount;
}
