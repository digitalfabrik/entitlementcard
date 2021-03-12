import 'package:ehrenamtskarte/graphql/graphql_api.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:provider/provider.dart';

import 'application_model.dart';

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
                onSaved: _onSaved,
                validator: FormBuilderValidators.compose(
                    [FormBuilderValidators.required(context)]),
                options: [
                  FormBuilderFieldOption(
                    value: ApplicationType.firstApplication,
                    child: Text('Blaue Ehrenamtskarte\nErstbeantragung'),
                  ),
                  FormBuilderFieldOption(
                    value: ApplicationType.renewalApplication,
                    child: Text('Blaue Ehrenamtskarte\nerneute Ausstellung'),
                  ),
                  FormBuilderFieldOption(
                    value: null,
                    child: Text('Goldene Ehrenamtskarte'),
                  ),
                ]),
          ],
        ));
  }

  _onSaved(value) {
    final applicationModel =
        Provider.of<ApplicationModel>(context, listen: false);
    if (value != null) {
      final blueCardApplication = BlueEakCardApplicationInput(
          applicationType: null,
          entitlement: null,
          givenInformationIsCorrectAndComplete: null,
          hasAcceptedPrivacyPolicy: null,
          personalData: null);
      if (value == ApplicationType.firstApplication) {
        blueCardApplication.applicationType = ApplicationType.firstApplication;
      } else if (value == ApplicationType.firstApplication) {
        blueCardApplication.applicationType =
            ApplicationType.renewalApplication;
      }
      applicationModel.setBlueCardApplication(blueCardApplication);
    } else {
      final goldenCardApplication = GoldenEakCardApplicationInput(
          entitlement: null,
          givenInformationIsCorrectAndComplete: null,
          hasAcceptedPrivacyPolicy: null,
          personalData: null);
      applicationModel.setGoldenCardApplication(goldenCardApplication);
    }
  }
}
