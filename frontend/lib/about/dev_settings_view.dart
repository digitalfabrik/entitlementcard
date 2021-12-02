import 'dart:developer';

import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../identification/base_card_details.dart';
import '../identification/card_details.dart';
import '../identification/card_details_model.dart';
import '../intro_slides/intro_screen.dart';
import '../routing.dart';

// this data includes a Base32 encoded random key created with openssl
// for testing, so this is intended
final validEakDetails = CardDetails(
    "Jane Doe", "aGVsbG8gdGhpcyBpcyBhIHRlc3Q=", 1677542400, CardType.standard, 42, "MZLBSF6VHD56ROVG55J6OKJCZIPVDPCX");

class DevSettingsView extends StatelessWidget {
  const DevSettingsView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsModel>(context);
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
              title: const Text('Log sample exception'),
              onTap: () => log("Sample exception.", error: Exception("Sample exception..."))),
          ListTile(
            title: const Text('Inspect settings'),
            onTap: () {
              showDialog<bool>(
                context: context,
                builder: (context) =>
                    SimpleDialog(title: const Text("Settings"), children: [Text(settings.toString())]),
              );
            },
          ),
        ],
      ),
    );
  }

  Future<void> _resetEakData(BuildContext context) async {
    Provider.of<CardDetailsModel>(context, listen: false).clearCardDetails();
  }

  Future<void> _setValidEakData(BuildContext context) async {
    Provider.of<CardDetailsModel>(context, listen: false).setCardDetails(validEakDetails);
  }

  void _showInfoSlides(BuildContext context) {
    Navigator.push(
        context,
        AppRoute(
          builder: (context) => const IntroScreen(),
        ));
  }
}
