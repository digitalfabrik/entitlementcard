import 'package:flutter/foundation.dart';

import '../graphql/graphql_api.graphql.dart';

class ApplicationModel extends ChangeNotifier {
  BlueCardApplicationInput _blueCardApplication;
  GoldenEakCardApplicationInput _goldenCardApplication;
  int regionId;

  BlueCardApplicationInput get blueCardApplication {
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
        surname: null,
        address: AddressInput(
            street: '', houseNumber: '', location: '', postalCode: ''));
    final entitlement = BlueCardEntitlementInput(
        workAtOrganizations: <WorkAtOrganizationInput>[],
        entitlementType: null,
        serviceEntitlement: BlueCardServiceEntitlementInput(
            organization: OrganizationInput(
                contact: OrganizationContactInput(
                    email: '',
                    telephone: '',
                    name: '',
                    hasGivenPermission: null),
                category: '',
                name: '',
                address: AddressInput(
                    street: '',
                    postalCode: '',
                    houseNumber: '',
                    location: ''))));
    _blueCardApplication = BlueCardApplicationInput(
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
      surname: null,
      address: AddressInput(
          street: '', houseNumber: '', location: '', postalCode: ''),
    );
    final entitlement = GoldenCardEntitlementInput(goldenEntitlementType: null);
    _goldenCardApplication = GoldenEakCardApplicationInput(
        entitlement: entitlement,
        personalData: personalData,
        hasAcceptedPrivacyPolicy: null,
        givenInformationIsCorrectAndComplete: null);
    notifyListeners();
  }

  void initBlueCardEntitlement(
      BlueCardEntitlementType blueCardEntitlementType) {
    if (_blueCardApplication?.entitlement?.entitlementType ==
        blueCardEntitlementType) {
      return;
    }
    initializeBlueCardApplication();
    switch (blueCardEntitlementType) {
      case BlueCardEntitlementType.juleica:
        _blueCardApplication.entitlement = BlueCardEntitlementInput(
            entitlementType: BlueCardEntitlementType.juleica);
        break;
      case BlueCardEntitlementType.service:
        _blueCardApplication.entitlement = BlueCardEntitlementInput(
            entitlementType: BlueCardEntitlementType.service,
            serviceEntitlement: BlueCardServiceEntitlementInput(
                organization: OrganizationInput(
                    address: null,
                    category: '',
                    name: '',
                    contact: OrganizationContactInput(
                        hasGivenPermission: null,
                        telephone: '',
                        name: '',
                        email: ''))));
        break;
      case BlueCardEntitlementType.standard:
        _blueCardApplication.entitlement = BlueCardEntitlementInput(
          workAtOrganizations: <WorkAtOrganizationInput>[],
          entitlementType: BlueCardEntitlementType.standard,
        );
        break;
      default:
        break;
    }
    notifyListeners();
  }

  void initGoldenCardEntitlement(
      GoldenCardEntitlementType goldenCardEntitlementType) {
    if (_goldenCardApplication?.entitlement?.goldenEntitlementType ==
        goldenCardEntitlementType) {
      return;
    }
    initializeGoldenCardApplication();
    switch (goldenCardEntitlementType) {
      case GoldenCardEntitlementType.honorByMinisterPresident:
        _goldenCardApplication.entitlement = GoldenCardEntitlementInput(
            goldenEntitlementType: goldenCardEntitlementType);
        break;
      case GoldenCardEntitlementType.serviceAward:
        _goldenCardApplication.entitlement = GoldenCardEntitlementInput(
            goldenEntitlementType: goldenCardEntitlementType);
        break;
      case GoldenCardEntitlementType.standard:
        _goldenCardApplication.entitlement = GoldenCardEntitlementInput(
            goldenEntitlementType: goldenCardEntitlementType,
            workAtOrganizations: <WorkAtOrganizationInput>[]);
        break;
      default:
        break;
    }
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

  bool hasGoldCardApplication() => _goldenCardApplication != null;

  void setBlueCardApplication(BlueCardApplicationInput blueCardApplication) {
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
