import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:provider/provider.dart';

import '../graphql/graphql_api.dart';
import 'application_model.dart';

class CardTypeStep extends StatelessWidget {
  final GlobalKey<FormBuilderState> formKey;

  const CardTypeStep({Key key, this.formKey}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FormBuilder(
        key: formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            FormBuilderRadioGroup(
                activeColor: Theme.of(context).colorScheme.primary,
                name: 'card_type',
                onSaved: (value) => _onSaved(context, value),
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
                    value: ApplicationType.artemisUnknown,
                    child: Text('Goldene Ehrenamtskarte'),
                  ),
                ]),
          ],
        ));
  }

  void _onSaved(BuildContext context, ApplicationType value) {
    final applicationModel =
        Provider.of<ApplicationModel>(context, listen: false);
    if (value == ApplicationType.firstApplication) {
      applicationModel.initializeBlueCardApplication();
      applicationModel.blueCardApplication.applicationType =
          ApplicationType.firstApplication;
    } else if (value == ApplicationType.renewalApplication) {
      applicationModel.initializeBlueCardApplication();
      applicationModel.blueCardApplication.applicationType =
          ApplicationType.renewalApplication;
    } else {
      applicationModel.initializeGoldenCardApplication();
    }
    applicationModel.updateListeners();
  }
}
