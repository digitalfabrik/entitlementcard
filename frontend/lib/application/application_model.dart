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

  void initializeBlueCardApplication() {
    _goldenCardApplication = null;
    if (_blueCardApplication != null) return;

    final personalData = PersonalDataInput(
        dateOfBirth: null,
        emailAddress: null,
        forenames: null,
        houseNumber: null,
        location: null,
        postalCode: null,
        street: null,
        surname: null);
    final entitlement = BlueCardEntitlementInput(blueEntitlementType: null);
    _blueCardApplication = BlueEakCardApplicationInput(
        applicationType: null,
        entitlement: entitlement,
        givenInformationIsCorrectAndComplete: null,
        hasAcceptedPrivacyPolicy: null,
        personalData: personalData);
    notifyListeners();
  }

  void initializeGoldenCardApplication() {
    _blueCardApplication = null;
    if (_goldenCardApplication != null) return;

    final personalData = PersonalDataInput(
        dateOfBirth: null,
        emailAddress: null,
        forenames: null,
        houseNumber: null,
        location: null,
        postalCode: null,
        street: null,
        surname: null);
    final entitlement = GoldenCardEntitlementInput(goldenEntitlementType: null);
    _goldenCardApplication = GoldenEakCardApplicationInput(
        entitlement: entitlement,
        personalData: personalData,
        hasAcceptedPrivacyPolicy: null,
        givenInformationIsCorrectAndComplete: null);
    notifyListeners();
  }

  PersonalDataInput get personalData {
    if (_blueCardApplication != null) {
      return _blueCardApplication.personalData;
    } else if (_goldenCardApplication != null) {
      return _goldenCardApplication.personalData;
    }
    return null;
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
