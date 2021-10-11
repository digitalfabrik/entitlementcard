import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';

import '../../graphql/graphql_api.dart';
import '../textwidgets/form_header_text.dart';

class Organization extends StatelessWidget {
  final OrganizationInput organizationInput;

  const Organization({Key key, this.organizationInput}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          const FormHeaderText("Organisationsdaten"),
          TextFormField(
            decoration: const InputDecoration(
                labelText:
                    'Name des Vereins, der Organisation, der Initiative *'),
            initialValue: organizationInput?.name,
            onSaved: (value) {
              organizationInput?.name = value;
            },
          ),
          TextFormField(
            validator: FormBuilderValidators.required(context),
            decoration: const InputDecoration(labelText: 'Straße *'),
            initialValue: organizationInput?.address?.street,
            onSaved: (value) {
              organizationInput?.address?.street = value;
            },
          ),
          TextFormField(
            decoration: const InputDecoration(labelText: "Hausnummer *"),
            validator: FormBuilderValidators.required(context),
            initialValue: organizationInput?.address?.houseNumber,
            onSaved: (value) {
              organizationInput?.address?.houseNumber = value;
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
            initialValue: organizationInput?.address?.postalCode,
            onSaved: (value) {
              organizationInput?.address?.postalCode = value;
            },
          ),
          TextFormField(
            validator: FormBuilderValidators.required(context),
            decoration: const InputDecoration(labelText: 'Ort *'),
            initialValue: organizationInput?.address?.location,
            onSaved: (value) {
              organizationInput?.address?.location = value;
            },
          ),
          const SizedBox(height: 24),
          const FormHeaderText("Kontaktperson"),
          TextFormField(
            validator: FormBuilderValidators.required(context),
            decoration: const InputDecoration(labelText: 'Name *'),
            initialValue: organizationInput?.contact?.name,
            onSaved: (value) {
              organizationInput?.contact?.name = value;
            },
          ),
          TextFormField(
            validator: FormBuilderValidators.compose([
              FormBuilderValidators.required(context),
              FormBuilderValidators.email(context),
            ]),
            keyboardType: TextInputType.emailAddress,
            decoration: const InputDecoration(labelText: 'E-Mail *'),
            initialValue: organizationInput?.contact?.email,
            onSaved: (value) {
              organizationInput?.contact?.email = value;
            },
          ),
          TextFormField(
            decoration: const InputDecoration(labelText: "Telefon (tagsüber)"),
            keyboardType: TextInputType.phone,
            initialValue: organizationInput?.contact?.telephone,
            onSaved: (value) {
              organizationInput?.contact?.telephone = value;
            },
          ),
          FormBuilderCheckbox(
              name: 'has_given_permission',
              initialValue:
                  organizationInput?.contact?.hasGivenPermission ?? false,
              validator: FormBuilderValidators.equal(
                context,
                true,
                errorText: 'Zustimmung erforderlich',
              ),
              onSaved: (value) =>
                  {organizationInput?.contact?.hasGivenPermission = value},
              title: const Text('Kontaktperson hat der Weitergabe der Daten und'
                  ' möglicher Kontaktaufnahme zugestimmt')),
        ]);
  }
}
