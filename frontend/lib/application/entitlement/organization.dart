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
          FormHeaderText("Organisationsdaten"),
          TextFormField(
            decoration: InputDecoration(
                labelText:
                    'Name des Vereins, der Organisation, der Initiative *'),
            onSaved: (value) {
              organizationInput.name = value;
            },
          ),
          TextFormField(
            validator: FormBuilderValidators.required(context),
            decoration: InputDecoration(labelText: 'Straße *'),
            onSaved: (value) {
              organizationInput.address.street = value;
            },
          ),
          TextFormField(
            decoration: InputDecoration(labelText: "Hausnummer *"),
            validator: FormBuilderValidators.compose([
              FormBuilderValidators.required(context),
              FormBuilderValidators.numeric(context),
            ]),
            keyboardType: TextInputType.number,
            onSaved: (value) {
              organizationInput.address.houseNumber = value;
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
              organizationInput.address.postalCode = value;
            },
          ),
          TextFormField(
            validator: FormBuilderValidators.required(context),
            decoration: InputDecoration(labelText: 'Ort *'),
            onSaved: (value) {
              organizationInput.address.location = value;
            },
          ),
          SizedBox(
            height: 24,
          ),
          FormHeaderText("Kontaktperson"),
          TextFormField(
            validator: FormBuilderValidators.required(context),
            decoration: InputDecoration(labelText: 'Name *'),
            onSaved: (value) {
              organizationInput.contact.name = value;
            },
          ),
          TextFormField(
            validator: FormBuilderValidators.compose([
              FormBuilderValidators.required(context),
              FormBuilderValidators.email(context),
            ]),
            keyboardType: TextInputType.emailAddress,
            decoration: InputDecoration(labelText: 'E-Mail *'),
            onSaved: (value) {
              organizationInput.contact.email = value;
            },
          ),
          TextFormField(
            decoration: InputDecoration(labelText: "Telefon (tagsüber)"),
            keyboardType: TextInputType.phone,
            onSaved: (value) {
              organizationInput.contact.telephone = value;
            },
          ),
          FormBuilderCheckbox(
              name: 'has_given_permission',
              initialValue: false,
              validator: FormBuilderValidators.equal(
                context,
                true,
                errorText: 'Zustimmung erforderlich',
              ),
              onSaved: (value) =>
                  {organizationInput.contact.hasGivenPermission = value},
              title: Text('Kontaktperson hat der Weitergabe der Daten und'
                  ' möglicher Kontaktaufnahme zugestimmt')),
        ]);
  }
}
