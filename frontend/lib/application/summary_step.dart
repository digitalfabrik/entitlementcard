import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:provider/provider.dart';

import 'application_model.dart';

class SummaryStep extends StatelessWidget {
  final GlobalKey<FormBuilderState> formKey;

  const SummaryStep({Key key, this.formKey}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final applicationModel =
        Provider.of<ApplicationModel>(context, listen: false);
    return FormBuilder(
        key: formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            FormBuilderCheckbox(
                name: 'privacy_policy',
                initialValue: applicationModel
                        .blueCardApplication?.hasAcceptedPrivacyPolicy ??
                    applicationModel
                        .goldenCardApplication?.hasAcceptedPrivacyPolicy ??
                    false,
                validator: FormBuilderValidators.equal(
                  context,
                  true,
                  errorText: 'Zustimmung erforderlich',
                ),
                onSaved: (value) =>
                    _onPrivacyPolicySaved(context, applicationModel, value),
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
                onSaved: (value) => _onCorrectAndCompleteSaved(
                    context, applicationModel, value),
                title: Text('Die hier angegeben Informationen sind'
                    ' richtig und vollständig.')),
          ],
        ));
  }

  void _onPrivacyPolicySaved(
      BuildContext context, ApplicationModel applicationModel, bool value) {
    if (applicationModel.hasBlueCardApplication()) {
      applicationModel.blueCardApplication.hasAcceptedPrivacyPolicy = value;
    } else if (applicationModel.hasGoldCardApplication()) {
      applicationModel.goldenCardApplication.hasAcceptedPrivacyPolicy = value;
    }
  }

  void _onCorrectAndCompleteSaved(
      BuildContext context, ApplicationModel applicationModel, bool value) {
    if (applicationModel.hasBlueCardApplication()) {
      applicationModel
          .blueCardApplication.givenInformationIsCorrectAndComplete = value;
    } else if (applicationModel.hasGoldCardApplication()) {
      applicationModel
          .goldenCardApplication.givenInformationIsCorrectAndComplete = value;
    }
  }
}
