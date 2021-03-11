import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';

class SummaryStep extends StatefulWidget {
  final GlobalKey<FormBuilderState> formKey;

  const SummaryStep({Key key, this.formKey}) : super(key: key);

  @override
  _SummaryStepState createState() => _SummaryStepState();
}

class _SummaryStepState extends State<SummaryStep> {
  @override
  Widget build(BuildContext context) {
    return FormBuilder(
        key: widget.formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Text("Überblick der Daten"),
          ],
        ));
  }
}
