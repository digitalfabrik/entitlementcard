import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import 'application_model.dart';

class PersonalDataStep extends StatelessWidget {
  final GlobalKey<FormBuilderState> formKey;

  const PersonalDataStep({Key? key, required this.formKey}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var personalData =
        Provider.of<ApplicationModel>(context, listen: false).personalData;
    var dateOfBirth = personalData?.dateOfBirth;
    return FormBuilder(
        key: formKey,
        child: Column(children: <Widget>[
          TextFormField(
            decoration: const InputDecoration(labelText: 'Titel'),
            initialValue: personalData?.title,
            onSaved: (value) {
              personalData?.title = value;
            },
          ),
          TextFormField(
            validator: FormBuilderValidators.required(context),
            decoration: const InputDecoration(labelText: 'Nachname *'),
            initialValue: personalData?.surname,
            onSaved: (value) {
              personalData?.surname = value;
            },
          ),
          TextFormField(
            validator: FormBuilderValidators.required(context),
            decoration: const InputDecoration(labelText: 'Vorname(n) *'),
            initialValue: personalData?.forenames,
            onSaved: (value) {
              personalData?.forenames = value;
            },
          ),
          FormBuilderDateTimePicker(
            name: 'date',
            inputType: InputType.date,
            initialEntryMode: DatePickerEntryMode.input,
            format: DateFormat('dd.MM.yyyy'),
            lastDate: DateTime.now(),
            validator: FormBuilderValidators.required(context),
            decoration: const InputDecoration(labelText: 'Geburtsdatum *'),
            initialValue: dateOfBirth != null
                ? DateFormat('dd.MM.yyyy').parse(dateOfBirth)
                : null,
            onSaved: (value) {
              if (value != null) {
                dateOfBirth = DateFormat('dd.MM.yyyy').format(value);
              }
            },
          ),
          FormBuilderDropdown(
            name: 'gender',
            decoration: const InputDecoration(labelText: 'Geschlecht'),
            allowClear: true,
            items: ['weiblich', 'männlich', 'divers']
                .map((gender) => DropdownMenuItem(
                      value: gender,
                      child: Text(gender),
                    ))
                .toList(),
            initialValue: personalData?.gender,
            onSaved: (String? value) {
              if (value != null) {
                personalData?.gender = value;
              }
            },
          ),
          TextFormField(
            decoration: const InputDecoration(labelText: 'Nationalität'),
            initialValue: personalData?.nationality,
            onSaved: (value) {
              personalData?.nationality = value;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            validator: FormBuilderValidators.required(context),
            decoration: const InputDecoration(labelText: 'Straße *'),
            initialValue: personalData?.address?.street,
            onSaved: (value) {
              personalData?.address?.street = value;
            },
          ),
          TextFormField(
            decoration: const InputDecoration(labelText: "Hausnummer *"),
            validator: FormBuilderValidators.required(context),
            initialValue: personalData?.address?.houseNumber,
            onSaved: (value) {
              personalData?.address?.houseNumber = value;
            },
          ),
          TextFormField(
            decoration: const InputDecoration(labelText: 'Adresszusatz'),
            initialValue: personalData?.address?.addressSupplement,
            onSaved: (value) {
              personalData?.address?.addressSupplement = value;
            },
          ),
          TextFormField(
            decoration: const InputDecoration(labelText: "Postleitzahl *"),
            validator: FormBuilderValidators.compose([
              FormBuilderValidators.required(context),
              FormBuilderValidators.numeric(context),
              FormBuilderValidators.minLength(context, 5),
              FormBuilderValidators.maxLength(context, 5),
            ]),
            keyboardType: TextInputType.number,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly],
            initialValue: personalData?.address?.postalCode,
            onSaved: (value) {
              personalData?.address?.postalCode = value;
            },
          ),
          TextFormField(
            validator: FormBuilderValidators.required(context),
            decoration: const InputDecoration(labelText: 'Ort *'),
            initialValue: personalData?.address?.location,
            onSaved: (value) {
              personalData?.address?.location = value;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            validator: FormBuilderValidators.compose([
              FormBuilderValidators.required(context),
              FormBuilderValidators.email(context),
            ]),
            keyboardType: TextInputType.emailAddress,
            decoration: const InputDecoration(labelText: 'E-Mail *'),
            initialValue: personalData?.emailAddress,
            onSaved: (value) {
              personalData?.emailAddress = value;
            },
          ),
          TextFormField(
            decoration: const InputDecoration(labelText: "Telefon"),
            keyboardType: TextInputType.phone,
            initialValue: personalData?.telephone,
            onSaved: (value) {
              personalData?.telephone = value;
            },
          ),
        ]));
  }
}
