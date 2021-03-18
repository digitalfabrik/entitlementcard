import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:provider/provider.dart';

import '../graphql/graphql_api.graphql.dart';
import 'application_model.dart';

class EntitlementTypeGold extends StatefulWidget {
  final GlobalKey<FormBuilderState> formKey;

  const EntitlementTypeGold({Key key, this.formKey}) : super(key: key);

  @override
  _EntitlementTypeGoldState createState() => _EntitlementTypeGoldState();
}

class _EntitlementTypeGoldState extends State<EntitlementTypeGold> {
  @override
  Widget build(BuildContext context) {
    final applicationModel =
        Provider.of<ApplicationModel>(context, listen: false);
    return FormBuilder(
        key: widget.formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            FormBuilderRadioGroup(
                decoration: InputDecoration(labelText: 'Voraussetzungen'),
                name: 'card_type',
                onSaved: (value) =>
                    applicationModel.initGoldenCardEntitlement(value),
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
}
