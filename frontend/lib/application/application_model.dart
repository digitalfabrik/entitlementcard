import 'package:flutter/foundation.dart';

import '../graphql/graphql_api.graphql.dart';

class ApplicationModel extends ChangeNotifier {
  BlueEakCardApplicationInput _blueCardApplication;
  GoldenEakCardApplicationInput _goldenCardApplication;

  BlueEakCardApplicationInput get blueCardApplication {
    return _blueCardApplication;
  }

  GoldenEakCardApplicationInput get goldenCardApplication {
    return _goldenCardApplication;
  }

  bool hasBlueCardApplication() => _blueCardApplication != null;

  void setBlueCardApplication(BlueEakCardApplicationInput blueCardApplication) {
    _blueCardApplication = blueCardApplication;
    _goldenCardApplication = null;
    notifyListeners();
  }

  void setGoldenCardApplication(
      GoldenEakCardApplicationInput goldenCardApplication) {
    _goldenCardApplication = goldenCardApplication;
    _blueCardApplication = null;
    notifyListeners();
  }

  void clearBlueCardApplication() {
    _blueCardApplication = null;
    notifyListeners();
  }

  void clearGoldenCardApplication() {
    _goldenCardApplication = null;
    notifyListeners();
  }

  void updateListeners() => notifyListeners();
}
