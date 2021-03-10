import 'package:flutter/material.dart';

class OrganizationStep extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        TextFormField(
          decoration: InputDecoration(
              labelText: 'Name Verein / Organisation / Initiative'),
        ),
      ],
    );
  }
}
