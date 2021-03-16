import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:provider/provider.dart';

import '../graphql/graphql_api.graphql.dart';
import 'application_model.dart';

class EntitlementTypeBlue extends StatefulWidget {
  final GlobalKey<FormBuilderState> formKey;

  const EntitlementTypeBlue({Key key, this.formKey}) : super(key: key);

  @override
  _EntitlementTypeBlueState createState() => _EntitlementTypeBlueState();
}

class _EntitlementTypeBlueState extends State<EntitlementTypeBlue> {
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
                    value: BlueCardEntitlementType.juleica,
                    child: Text('Inhaber einer Jugenleiterkarte'),
                  ),
                  FormBuilderFieldOption(
                    value: BlueCardEntitlementType.service,
                    child: Text('Feuerwehr/Rettungsdienst'),
                  ),
                  FormBuilderFieldOption(
                    value: BlueCardEntitlementType.standard,
                    child: Text('Engangement seit mindestens 2 Jahren'),
                  ),
                ]),
          ],
        ));
  }

  _onSaved(value) {
    final applicationModel =
        Provider.of<ApplicationModel>(context, listen: false);
    if (applicationModel.hasBlueCardApplication()) {
      final blueCardApplication = applicationModel.blueCardApplication;
      blueCardApplication.entitlement.blueEntitlementType = value;
      applicationModel.updateListeners();
    }
  }
}
