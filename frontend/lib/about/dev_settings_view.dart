import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../application/application_model.dart';
import '../graphql/graphql_api.graphql.dart';
import '../identification/base_card_details.dart';
import '../identification/card_details.dart';
import '../identification/card_details_model.dart';
import '../intro_slides/intro_screen.dart';

// this data includes a Base32 encoded random key created with openssl
// for testing, so this is intended
final validEakDetails = CardDetails("Jane Doe", "aGVsbG8gdGhpcyBpcyBhIHRlc3Q=",
    1677542400, CardType.standard, 42, "MZLBSF6VHD56ROVG55J6OKJCZIPVDPCX");

class DevSettingsView extends StatelessWidget {
  const DevSettingsView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(15.0),
      child: Column(
        children: [
          ListTile(
            title: const Text('Reset EAK'),
            onTap: () => _resetEakData(context),
          ),
          ListTile(
            title: const Text('Set valid EAK data'),
            onTap: () => _setValidEakData(context),
          ),
          ListTile(
            title: const Text('Show Intro Slides'),
            onTap: () => _showInfoSlides(context),
          ),
          ListTile(
            title: const Text('Set application test data'),
            onTap: () => _createApplicationData(context),
          ),
          ListTile(
              title: const Text('Log sample execption'),
              onTap: () => log("Sample exception.",
                  error: Exception("Sample exception...")))
        ],
      ),
    );
  }

  Future<void> _resetEakData(BuildContext context) async {
    Provider.of<CardDetailsModel>(context, listen: false).clearCardDetails();
  }

  Future<void> _setValidEakData(BuildContext context) async {
    Provider.of<CardDetailsModel>(context, listen: false)
        .setCardDetails(validEakDetails);
  }

  void _showInfoSlides(BuildContext context) {
    Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => const IntroScreen(),
        ));
  }

  void _createApplicationData(BuildContext context) {
    final applicationModel =
        Provider.of<ApplicationModel>(context, listen: false);
    applicationModel.regionId = 9;
    var personalData = PersonalDataInput(
        address: AddressInput(
            street: "Abcstr.",
            houseNumber: "11",
            location: "Testhausen",
            postalCode: "11111"),
        dateOfBirth: "01.01.1990",
        emailAddress: "test@example.com",
        forenames: "Max",
        surname: "Mustermann");
    var organizationInput = OrganizationInput(
        address: AddressInput(
            street: "Musterfraustr.",
            houseNumber: "42",
            addressSupplement: "",
            location: "München",
            postalCode: "11111"),
        category: "Bildung",
        name: "Testorganisation",
        website: "example.com",
        contact: OrganizationContactInput(
            email: "orga@example.com",
            hasGivenPermission: true,
            name: "Hans Peter",
            telephone: "12345678"));
    var workAtOrganization = WorkAtOrganizationInput(
        amountOfWork: 20,
        amountOfWorkUnit: AmountOfWorkUnit.hoursPerWeek,
        payment: false,
        responsibility: "Keine Ahnung",
        workSinceDate: "1.1.2015",
        organization: organizationInput);
    var blueCardEntitlement = BlueCardEntitlementInput(
        entitlementType: BlueCardEntitlementType.standard,
        workAtOrganizations: <WorkAtOrganizationInput>[]);
    blueCardEntitlement.workAtOrganizations!.add(workAtOrganization);
    var blueCardApplicationInput = BlueCardApplicationInput(
        applicationType: ApplicationType.firstApplication,
        entitlement: blueCardEntitlement,
        givenInformationIsCorrectAndComplete: true,
        hasAcceptedPrivacyPolicy: true,
        personalData: personalData);
    applicationModel.setBlueCardApplication(blueCardApplicationInput);
  }
}
