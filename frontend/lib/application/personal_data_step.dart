import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import 'application_model.dart';

class PersonalDataStep extends StatelessWidget {
  final GlobalKey<FormBuilderState> formKey;

  const PersonalDataStep({Key key, this.formKey}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var personalData =
        Provider.of<ApplicationModel>(context, listen: false).personalData;
    return FormBuilder(
        key: formKey,
        child: Column(children: <Widget>[
          TextFormField(
            decoration: InputDecoration(labelText: 'Titel'),
            onSaved: (value) {
              personalData.title = value;
            },
          ),
          TextFormField(
            validator: FormBuilderValidators.required(context),
            decoration: InputDecoration(labelText: 'Nachname *'),
            onSaved: (value) {
              personalData.surname = value;
            },
          ),
          TextFormField(
            validator: FormBuilderValidators.required(context),
            decoration: InputDecoration(labelText: 'Vorname(n) *'),
            onSaved: (value) {
              personalData.forenames = value;
            },
          ),
          FormBuilderDateTimePicker(
            name: 'date',
            inputType: InputType.date,
            initialEntryMode: DatePickerEntryMode.input,
            format: DateFormat('dd.MM.yyyy'),
            lastDate: DateTime.now(),
            validator: FormBuilderValidators.required(context),
            decoration: InputDecoration(
              labelText: 'Geburtsdatum *',
            ),
            onSaved: (value) {
              personalData.dateOfBirth = DateFormat('dd.MM.yyyy').format(value);
            },
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
            onSaved: (value) {
              personalData.gender = value;
            },
          ),
          TextFormField(
            decoration: InputDecoration(labelText: 'Nationalität'),
            onSaved: (value) {
              personalData.nationality = value;
            },
          ),
          SizedBox(
            height: 16,
          ),
          TextFormField(
            validator: FormBuilderValidators.required(context),
            decoration: InputDecoration(labelText: 'Straße *'),
            onSaved: (value) {
              personalData.address.street = value;
            },
          ),
          TextFormField(
            decoration: InputDecoration(labelText: "Hausnummer *"),
            validator: FormBuilderValidators.required(context),
            onSaved: (value) {
              personalData.address.houseNumber = value;
            },
          ),
          TextFormField(
            decoration: InputDecoration(labelText: 'Adresszusatz'),
            onSaved: (value) {
              personalData.address.addressSupplement = value;
            },
          ),
          TextFormField(
            decoration: InputDecoration(labelText: "Postleitzahl *"),
            validator: FormBuilderValidators.compose([
              FormBuilderValidators.required(context),
              FormBuilderValidators.numeric(context),
              FormBuilderValidators.minLength(context, 5),
              FormBuilderValidators.maxLength(context, 5),
            ]),
            keyboardType: TextInputType.number,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly],
            onSaved: (value) {
              personalData.address.postalCode = value;
            },
          ),
          TextFormField(
            validator: FormBuilderValidators.required(context),
            decoration: InputDecoration(labelText: 'Ort *'),
            onSaved: (value) {
              personalData.address.location = value;
            },
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
            onSaved: (value) {
              personalData.emailAddress = value;
            },
          ),
          TextFormField(
            decoration: InputDecoration(labelText: "Telefon"),
            keyboardType: TextInputType.phone,
            onSaved: (value) {
              personalData.telephone = value;
            },
          ),
        ]));
  }
}
