import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:provider/provider.dart';

import '../graphql/graphql_api.graphql.dart';
import 'application_model.dart';

class EntitlementTypeBlue extends StatelessWidget {
  final GlobalKey<FormBuilderState> formKey;

  const EntitlementTypeBlue({Key key, this.formKey}) : super(key: key);

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
                name: 'card_type',
                initialValue: applicationModel
                    .blueCardApplication?.entitlement?.entitlementType,
                onSaved: (value) =>
                    applicationModel.initBlueCardEntitlement(value),
                validator: FormBuilderValidators.compose(
                    [FormBuilderValidators.required(context)]),
                options: [
                  FormBuilderFieldOption(
                    value: BlueCardEntitlementType.juleica,
                    child: Text('Inhaber:in einer Jugendleiterkarte'),
                  ),
                  FormBuilderFieldOption(
                    value: BlueCardEntitlementType.service,
                    child: Text('Feuerwehr/Rettungsdienst/Katastrophenschutz'),
                  ),
                  FormBuilderFieldOption(
                    value: BlueCardEntitlementType.standard,
                    child: Text("Engangement seit mindestens 2 Jahren"
                        " bei anderen Vereinen oder Organisationen"),
                  ),
                ]),
          ],
        ));
  }
}
