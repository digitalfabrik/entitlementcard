import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';

class OrganizationStep extends StatefulWidget {
  final GlobalKey<FormBuilderState> formKey;

  const OrganizationStep({Key key, this.formKey}) : super(key: key);

  @override
  _OrganizationStepState createState() => _OrganizationStepState();
}

class _OrganizationStepState extends State<OrganizationStep> {
  @override
  Widget build(BuildContext context) {
    return FormBuilder(
        key: widget.formKey,
        child: Column(
          children: <Widget>[
            TextFormField(
              decoration: InputDecoration(
                  labelText: 'Name Verein / Organisation / Initiative'),
            ),
          ],
        ));
  }
}
