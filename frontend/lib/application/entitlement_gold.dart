import 'package:ehrenamtskarte/graphql/graphql_api.graphql.dart';
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:provider/provider.dart';

import 'application_model.dart';

class EntitlementGold extends StatefulWidget {
  final GlobalKey<FormBuilderState> formKey;

  const EntitlementGold({Key key, this.formKey}) : super(key: key);

  @override
  _EntitlementGoldState createState() => _EntitlementGoldState();
}

class _EntitlementGoldState extends State<EntitlementGold> {
  @override
  Widget build(BuildContext context) {
    return FormBuilder(
        key: widget.formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            FormBuilderRadioGroup(
                decoration: InputDecoration(labelText: 'Voraussetzungen'),
                name: 'card_type',
                onSaved: _onSaved,
                validator: FormBuilderValidators.compose(
                    [FormBuilderValidators.required(context)]),
                options: [
                  FormBuilderFieldOption(
                    value: GoldenCardEntitlementType.honorByMinisterPresident,
                    child: Text('Inhaber*in des Ehrenzeichens des Bayerischen '
                        'Ministerpräsidenten'),
                  ),
                  FormBuilderFieldOption(
                    value: GoldenCardEntitlementType.serviceAward,
                    child: Text(
                        'Inhaber*in einer Dienstauszeichnung des Freistaats '
                        'Bayern nach dem Feuerwehr- und '
                        'Hilfsorganisationen-Ehrenzeichengesetz'),
                  ),
                  FormBuilderFieldOption(
                    value: GoldenCardEntitlementType.standard,
                    child: Text('Ehrenamtliche, die nachweislich mindestens 25 '
                        'Jahre mindestens 5 Stunden pro Woche oder 250 Stunden '
                        'pro Jahr ehrenamtlich tätig waren'),
                  ),
                ]),
          ],
        ));
  }

  _onSaved(value) {
    final applicationModel =
        Provider.of<ApplicationModel>(context, listen: false);
    final goldCardApplication = applicationModel.goldenCardApplication;
    goldCardApplication.entitlement.goldenEntitlementType = value;
    applicationModel.updateListeners();
  }
}
