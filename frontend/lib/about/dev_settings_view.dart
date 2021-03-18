import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../identification/base_card_details.dart';
import '../identification/card_details.dart';
import '../identification/card_details_model.dart';
import '../intro_slides/intro_screen.dart';

// this data includes a Base32 encoded random key created with openssl
// for testing, so this is intended
final validEakDetails = CardDetails("Jane Doe", "aGVsbG8gdGhpcyBpcyBhIHRlc3Q=",
    1677542400, CardType.standard, 42, "MZLBSF6VHD56ROVG55J6OKJCZIPVDPCX");

class DevSettingsView extends StatelessWidget {
  DevSettingsView({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(15.0),
      child: Column(
        children: [
          ListTile(
            title: Text('Reset EAK'),
            onTap: () => _resetEakData(context),
          ),
          ListTile(
            title: Text('Set valid EAK data'),
            onTap: () => _setValidEakData(context),
          ),
          ListTile(
            title: Text('Show Intro Slides'),
            onTap: () => _showInfoSlides(context),
          )
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
          builder: (context) => IntroScreen(),
        ));
  }
}
