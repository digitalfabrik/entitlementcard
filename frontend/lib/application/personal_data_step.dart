import 'package:flutter/material.dart';

class PersonalDataStep extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        TextFormField(
          decoration: InputDecoration(labelText: 'Home Address'),
        ),
        TextFormField(
          decoration: InputDecoration(labelText: 'Postcode'),
        ),
      ],
    );
  }
}
