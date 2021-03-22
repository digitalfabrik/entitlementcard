import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:form_builder_image_picker/form_builder_image_picker.dart';
import 'package:http/http.dart';
import 'package:http_parser/http_parser.dart';
import 'package:intl/intl.dart';

import '../../graphql/graphql_api.dart';
import '../textwidgets/form_header_text.dart';
import '../textwidgets/form_text.dart';
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
        FormHeaderText("Angaben zur ehrenamtlicher Tätigkeit"),
        FormBuilderDropdown(
          name: 'category',
          decoration: InputDecoration(
            labelText: 'Einsatzgebiet *',
          ),
          validator: FormBuilderValidators.required(context),
          onSaved: (value) =>
              {workAtOrganizationInput.organization.category = value},
          items: [
            'Soziales/Jugend/Senioren',
            'Tierschutz',
            'Sport',
            'Bildung',
            'Umwelt-/Naturschutz',
            'Kultur',
            'Gesundheit',
            'Katastrophenschutz/Feuerwehr/Rettungsdienst',
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
          onSaved: (value) => {workAtOrganizationInput.responsibility = value},
        ),
        SizedBox(
          height: 24,
        ),
        FormText(
          'Wird für diese ehrenamtliche Tätigkeit eine '
          'Aufwandsentschädigung gewährt, die über Auslagenersatz '
          'oder Erstattung der Kosten hinausgeht?',
        ),
        FormBuilderRadioGroup(
            name: 'payment',
            validator: FormBuilderValidators.required(context),
            onSaved: (value) => {workAtOrganizationInput.payment = value},
            options: [
              FormBuilderFieldOption(value: true, child: Text("Ja")),
              FormBuilderFieldOption(value: false, child: Text("Nein"))
            ]),
        TextFormField(
          decoration: InputDecoration(
              labelText: 'Arbeitsstunden pro Woche (Durchschnitt) *'),
          onSaved: (value) => {
            workAtOrganizationInput.amountOfWork = double.parse(value),
            workAtOrganizationInput.amountOfWorkUnit =
                AmountOfWorkUnit.hoursPerWeek
          },
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
          onSaved: (value) => {
            workAtOrganizationInput.workSinceDate =
                DateFormat('dd.MM.yyyy').format(value)
          },
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
        FormBuilderImagePicker(
          name: 'certificate',
          decoration: InputDecoration(
              labelText: 'Bestätigung der Organisation oder des Vereins'),
          maxImages: 1,
          onSaved: (value) => {
            if (value != null && value.isNotEmpty)
              workAtOrganizationInput.certificate = AttachmentInput(
                  fileName: 'bestaetigung.jpg',
                  data: MultipartFile.fromBytes(
                    'certificate',
                    value.first.readAsBytesSync(),
                    filename: 'bestaetigung.jpg',
                    contentType: MediaType("image", "jpg"),
                  ))
          },
        ),
      ],
    );
  }
}
