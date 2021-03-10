import 'package:flutter/material.dart';

class EntitlementStep extends StatefulWidget {
  @override
  _EntitlementStepState createState() => _EntitlementStepState();
}

class _EntitlementStepState extends State<EntitlementStep> {
  String _cardType;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        RadioListTile<String>(
          title: const Text('Inhaber einer Jugenleiterkarte'),
          value: "JULEICA",
          groupValue: _cardType,
          onChanged: (value) {
            setState(() {
              _cardType = value;
            });
          },
        ),
        RadioListTile<String>(
          title: const Text('Feuerwehr/Rettungsdienst'),
          value: "SPECIAL",
          groupValue: _cardType,
          onChanged: (value) {
            setState(() {
              _cardType = value;
            });
          },
        ),
        RadioListTile<String>(
          title: const Text('Engangement seit mindestens 2 Jahren'),
          value: "NORMAL",
          groupValue: _cardType,
          onChanged: (value) {
            setState(() {
              _cardType = value;
            });
          },
        ),
      ],
    );
  }
}
