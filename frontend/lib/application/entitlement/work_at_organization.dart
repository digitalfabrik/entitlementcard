import '../../graphql/graphql_api.dart';
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:intl/intl.dart';

import 'organization.dart';

class WorkAtOrganization extends StatelessWidget {
  final WorkAtOrganizationInput workAtOrganizationInput;

  const WorkAtOrganization({Key key, this.workAtOrganizationInput})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Organization(
          organizationInput: workAtOrganizationInput.organization,
        ),
        SizedBox(
          height: 24,
        ),
        Text("Angaben zur ehrenamtlicher Tätigkeit",
            style: Theme.of(context)
                .textTheme
                .subtitle1
                .apply(fontWeightDelta: 1)),
        FormBuilderDropdown(
          name: 'category',
          decoration: InputDecoration(
            labelText: 'Einsatzgebiet *',
          ),
          allowClear: true,
          items: [
            'Soziales/ Jugend/ Senioren',
            'Tierschutz',
            'Sport',
            'Bildung',
            'Umwelt-/ Naturschutz',
            'Kultur',
            'Gesundheit',
            'Katastrophenschutz/ Feuerwehr/ Rettungsdienst',
            'Kirchen',
            'Andere'
          ]
              .map((category) => DropdownMenuItem(
                    value: category,
                    child: Text('$category'),
                  ))
              .toList(),
        ),
        TextFormField(
          decoration: InputDecoration(labelText: 'Funktionsbeschreibung'),
        ),
        SizedBox(
          height: 24,
        ),
        Text(
          'Wird für diese ehrenamtliche Tätigkeit eine '
          'Aufwandsentschädigung gewährt, die über Auslagenersatz '
          'oder Erstattung der Kosten hinaus geht? *',
          style: Theme.of(context)
              .textTheme
              .subtitle1
              .apply(color: Theme.of(context).hintColor),
        ),
        FormBuilderRadioGroup(
          name: 'payment',
          validator: FormBuilderValidators.required(context),
          options: ['Ja', 'Nein']
              .map((value) => FormBuilderFieldOption(value: value))
              .toList(growable: false),
        ),
        TextFormField(
          decoration: InputDecoration(
              labelText: 'Arbeitsstunden pro Woche (Durchschnitt) *'),
          validator: FormBuilderValidators.compose([
            FormBuilderValidators.required(context),
            FormBuilderValidators.numeric(context),
            FormBuilderValidators.min(context, 5)
          ]),
          keyboardType: TextInputType.number,
        ),
        FormBuilderDateTimePicker(
          name: 'date',
          inputType: InputType.date,
          format: DateFormat('dd.MM.yyyy'),
          lastDate: DateTime.now(),
          validator: FormBuilderValidators.compose([
            FormBuilderValidators.required(context),
            (date) {
              return date
                      .isAfter(DateTime.now().subtract(Duration(days: 365 * 2)))
                  ? 'Mindestens seit 2 Jahren'
                  : null;
            }
          ]),
          decoration: InputDecoration(
            labelText: 'Ehrenamtliche Tätigkeit seit *',
          ),
        ),
      ],
    );
  }
}
