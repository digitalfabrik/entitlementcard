import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:intl/intl.dart';

class OrganizationStep extends StatefulWidget {
  final GlobalKey<FormBuilderState> formKey;

  const OrganizationStep({Key key, this.formKey}) : super(key: key);

  @override
  _OrganizationStepState createState() => _OrganizationStepState();
}

class _OrganizationStepState extends State<OrganizationStep> {
  @override
  Widget build(BuildContext context) {
    return FormBuilder(
        key: widget.formKey,
        child: Column(
          children: <Widget>[
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
                  .map((gender) => DropdownMenuItem(
                        value: gender,
                        child: Text('$gender'),
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
                  labelText: 'Name Verein / Organisation / Initiative *'),
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
                  return date.isAfter(
                          DateTime.now().subtract(Duration(days: 365 * 2)))
                      ? 'Mindestens seit 2 Jahren'
                      : null;
                }
              ]),
              decoration: InputDecoration(
                labelText: 'Arbeit seit *',
              ),
            ),
          ],
        ));
  }
}
