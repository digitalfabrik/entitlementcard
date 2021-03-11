import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';

class CardTypeStep extends StatefulWidget {
  final GlobalKey<FormBuilderState> formKey;

  const CardTypeStep({Key key, this.formKey}) : super(key: key);

  @override
  _CardTypeStepState createState() => _CardTypeStepState();
}

class _CardTypeStepState extends State<CardTypeStep> {
  @override
  Widget build(BuildContext context) {
    return FormBuilder(
        key: widget.formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            FormBuilderRadioGroup(
              decoration: InputDecoration(labelText: 'Beantragung'),
              name: 'card_type',
              validator: FormBuilderValidators.compose(
                  [FormBuilderValidators.required(context)]),
              options: [
                'Blaue Ehrenamtskarte\nErstbeantragung',
                'Blaue Ehrenamtskarte\nerneute Ausstellung',
                'Goldene Ehrenamtskarte'
              ]
                  .map((lang) => FormBuilderFieldOption(
                        value: lang,
                        child: Text('$lang'),
                      ))
                  .toList(growable: false),
            ),
          ],
        ));
  }
}
