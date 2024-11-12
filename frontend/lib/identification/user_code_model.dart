import 'dart:collection';

import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/identification/user_code_store.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter/foundation.dart';

import 'package:ehrenamtskarte/sentry.dart';

enum _InitializationState { uninitialized, initializing, failed, initialized }

class UserCodeModel extends ChangeNotifier {
  UserCodeStore store = UserCodeStore();
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
    try {
      DynamicUserCode? legacyCode = await store.loadAndDeleteLegacyCard();
      var userCodes = await store.load();
      if (legacyCode != null && !isAlreadyInList(userCodes, legacyCode.info, legacyCode.pepper)) {
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

  Future<void> insertCode(DynamicUserCode code) async {
    _requireInitialized();
    if (isAlreadyInList(_userCodes, code.info, code.pepper)) return;
    _userCodes.add(code);
    await store.store(_userCodes);
    notifyListeners();
  }

  Future<void> updateCode(DynamicUserCode code) async {
    _requireInitialized();
    if (isAlreadyInList(_userCodes, code.info, code.pepper)) {
      _updateUserCode(_userCodes, code);
      await store.store(_userCodes);
      notifyListeners();
    } else {
      reportError('Ignoring update for user code as it is no longer in the list.', StackTrace.current);
    }
  }

  Future<void> removeCode(DynamicUserCode code) async {
    _requireInitialized();
    _userCodes.remove(code);
    await store.store(_userCodes);
    notifyListeners();
  }

  Future<void> removeCodes() async {
    _requireInitialized();
    await store.remove();
    _userCodes = [];
    notifyListeners();
  }
}

void _updateUserCode(List<DynamicUserCode> userCodes, DynamicUserCode userCode) {
  final index = userCodes.indexWhere((code) => code.info == userCode.info && code.pepper == userCode.pepper);
  userCodes[index] = userCode;
}

bool isAlreadyInList(List<DynamicUserCode> userCodes, CardInfo info, List<int> pepper) {
  return userCodes.any((userCode) => userCode.info == info && userCode.pepper == pepper);
}

bool hasReachedCardLimit(List<DynamicUserCode> userCodes) {
  return userCodes.length >= buildConfig.maxCardAmount;
}
