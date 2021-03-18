import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:provider/provider.dart';

import 'application_model.dart';

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
            FormBuilderCheckbox(
                name: 'privacy_policy',
                initialValue: false,
                validator: FormBuilderValidators.equal(
                  context,
                  true,
                  errorText: 'Zustimmung erforderlich',
                ),
                onSaved: _onPrivacyPolicySaved,
                title: Text('Hiermit erkläre ich mich damit einverstanden, dass'
                    ' meine Daten zum Zwecke der Zusendung von Informationen'
                    ' (z.B. zu bayernweiten Aktionen) rund um das Thema'
                    ' „Ehrenamtskarte“ gespeichert und ggf. an das Land Bayern'
                    ' weitergeleitet werden.')),
            FormBuilderCheckbox(
                name: 'correct_and_complete',
                initialValue: false,
                validator: FormBuilderValidators.equal(
                  context,
                  true,
                  errorText: 'Zustimmung erforderlich',
                ),
                onSaved: _onCorrectAndCompleteSaved,
                title: Text('Die hier angegeben Informationen sind'
                    ' richtig und vollständig')),
          ],
        ));
  }

  void _onPrivacyPolicySaved(value) {
    final applicationModel =
        Provider.of<ApplicationModel>(context, listen: false);
    if (applicationModel.hasBlueCardApplication()) {
      applicationModel.blueCardApplication.hasAcceptedPrivacyPolicy = value;
    } else if (applicationModel.hasGoldCardApplication()) {
      applicationModel.goldenCardApplication.hasAcceptedPrivacyPolicy = value;
    }
  }

  void _onCorrectAndCompleteSaved(value) {
    final applicationModel =
        Provider.of<ApplicationModel>(context, listen: false);
    if (applicationModel.hasBlueCardApplication()) {
      applicationModel
          .blueCardApplication.givenInformationIsCorrectAndComplete = value;
    } else if (applicationModel.hasGoldCardApplication()) {
      applicationModel
          .goldenCardApplication.givenInformationIsCorrectAndComplete = value;
    }
  }
}
