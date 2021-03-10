import 'package:flutter/material.dart';

class CardTypeStep extends StatefulWidget {
  @override
  _CardTypeStepState createState() => _CardTypeStepState();
}

class _CardTypeStepState extends State<CardTypeStep> {
  String _cardType;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        RadioListTile<String>(
          title: const Text('Blau Erstbeantragung'),
          value: "1",
          groupValue: _cardType,
          onChanged: (value) {
            setState(() {
              _cardType = value;
            });
          },
        ),
        RadioListTile<String>(
          title: const Text('Blau erneute Ausstellung'),
          value: "2",
          groupValue: _cardType,
          onChanged: (value) {
            setState(() {
              _cardType = value;
            });
          },
        ),
        RadioListTile<String>(
          title: const Text('Gold Erstbeantragung'),
          value: "3",
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
