import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:intl/intl.dart';

class PersonalDataStep extends StatefulWidget {
  final GlobalKey<FormBuilderState> formKey;

  const PersonalDataStep({Key key, this.formKey}) : super(key: key);

  @override
  _PersonalDataStepState createState() => _PersonalDataStepState();
}

class _PersonalDataStepState extends State<PersonalDataStep> {
  @override
  Widget build(BuildContext context) {
    return FormBuilder(
        key: widget.formKey,
        child: Column(children: <Widget>[
          TextFormField(
            decoration: InputDecoration(labelText: 'Titel'),
          ),
          TextFormField(
            validator: FormBuilderValidators.required(context),
            decoration: InputDecoration(labelText: 'Nachname*'),
          ),
          TextFormField(
            validator: FormBuilderValidators.required(context),
            decoration: InputDecoration(labelText: 'Vorname(n) *'),
          ),
          FormBuilderDateTimePicker(
            name: 'date',
            inputType: InputType.date,
            format: DateFormat('dd.MM.yyyy'),
            lastDate: DateTime.now(),
            validator: FormBuilderValidators.required(context),
            decoration: InputDecoration(
              labelText: 'Geburtsdatum *',
            ),
          ),
          FormBuilderDropdown(
            name: 'gender',
            decoration: InputDecoration(
              labelText: 'Geschlecht',
            ),
            allowClear: true,
            items: ['weiblich', 'männlich', 'divers']
                .map((gender) => DropdownMenuItem(
                      value: gender,
                      child: Text('$gender'),
                    ))
                .toList(),
          ),
          TextFormField(
            decoration: InputDecoration(labelText: 'Nationalität'),
          ),
          SizedBox(
            height: 16,
          ),
          TextFormField(
            decoration: InputDecoration(labelText: 'Adresszusatz'),
          ),
          TextFormField(
            validator: FormBuilderValidators.required(context),
            decoration: InputDecoration(labelText: 'Straße *'),
          ),
          TextFormField(
            decoration: InputDecoration(labelText: "Hausnummer *"),
            validator: FormBuilderValidators.compose([
              FormBuilderValidators.required(context),
              FormBuilderValidators.numeric(context),
            ]),
            keyboardType: TextInputType.number,
          ),
          TextFormField(
            decoration: InputDecoration(labelText: "PLZ *"),
            validator: FormBuilderValidators.compose([
              FormBuilderValidators.required(context),
              FormBuilderValidators.numeric(context),
              FormBuilderValidators.minLength(context, 5),
              FormBuilderValidators.maxLength(context, 5),
            ]),
            keyboardType: TextInputType.number,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly],
          ),
          TextFormField(
            validator: FormBuilderValidators.required(context),
            decoration: InputDecoration(labelText: 'Ort *'),
          ),
          SizedBox(
            height: 16,
          ),
          TextFormField(
            validator: FormBuilderValidators.compose([
              FormBuilderValidators.required(context),
              FormBuilderValidators.email(context),
            ]),
            keyboardType: TextInputType.emailAddress,
            decoration: InputDecoration(labelText: 'E-Mail *'),
          ),
          TextFormField(
            decoration: InputDecoration(labelText: "Telefon"),
            keyboardType: TextInputType.phone,
          ),
        ]));
  }
}
