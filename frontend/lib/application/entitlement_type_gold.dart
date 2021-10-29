import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:provider/provider.dart';

import '../graphql/graphql_api.graphql.dart';
import 'application_model.dart';

class EntitlementTypeGold extends StatelessWidget {
  final GlobalKey<FormBuilderState> formKey;

  const EntitlementTypeGold({Key? key, required this.formKey}) : super(key: key);

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
                decoration: const InputDecoration(labelText: 'Voraussetzungen'),
                name: 'card_type',
                initialValue: applicationModel
                    .goldenCardApplication?.entitlement?.goldenEntitlementType,
                onSaved: (value) =>
                    applicationModel.initGoldenCardEntitlement(value),
                validator: FormBuilderValidators.compose(
                    [FormBuilderValidators.required(context)]),
                options: const [
                  FormBuilderFieldOption(
                    value: GoldenCardEntitlementType.honorByMinisterPresident,
                    child: Text('Inhaber:in des Ehrenzeichens des Bayerischen '
                        'Ministerpräsidenten'),
                  ),
                  FormBuilderFieldOption(
                    value: GoldenCardEntitlementType.serviceAward,
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 5),
                      child: Text(
                          'Inhaber:in einer Dienstauszeichnung des Freistaats '
                          'Bayern nach dem Feuerwehr- und '
                          'Hilfsorganisationen-Ehrenzeichengesetz'),
                    ),
                  ),
                  FormBuilderFieldOption(
                    value: GoldenCardEntitlementType.standard,
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 5),
                      child:
                          Text('Ehrenamtliche, die nachweislich mindestens 25 '
                              'Jahre mindestens 5 Stunden pro Woche oder 250 '
                              'Stunden pro Jahr ehrenamtlich tätig waren'),
                    ),
                  ),
                ]),
          ],
        ));
  }
}
