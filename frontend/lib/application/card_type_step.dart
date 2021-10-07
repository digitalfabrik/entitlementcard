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
    final applicationModel =
        Provider.of<ApplicationModel>(context, listen: false);
    return FormBuilder(
        key: formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            FormBuilderRadioGroup(
                activeColor: Theme.of(context).colorScheme.primary,
                name: 'card_type',
                initialValue: _getApplicationType(context, applicationModel),
                onSaved: (value) => _onSaved(context, applicationModel, value),
                validator: FormBuilderValidators.compose(
                    [FormBuilderValidators.required(context)]),
                options: const [
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

  ApplicationType _getApplicationType(
      BuildContext context, ApplicationModel applicationModel) {
    if (applicationModel.hasBlueCardApplication()) {
      return applicationModel.blueCardApplication.applicationType;
    } else if (applicationModel.hasGoldCardApplication()) {
      return ApplicationType.artemisUnknown;
    }
    return null;
  }

  void _onSaved(BuildContext context, ApplicationModel applicationModel,
      ApplicationType value) {
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
