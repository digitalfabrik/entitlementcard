import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';

class EntitlementStep extends StatefulWidget {
  final GlobalKey<FormBuilderState> formKey;

  const EntitlementStep({Key key, this.formKey}) : super(key: key);

  @override
  _EntitlementStepState createState() => _EntitlementStepState();
}

class _EntitlementStepState extends State<EntitlementStep> {
  String _cardType;

  @override
  Widget build(BuildContext context) {
    return FormBuilder(
        key: widget.formKey,
        child: Column(
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
        ));
  }
}
