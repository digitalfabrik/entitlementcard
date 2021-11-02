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

  const WorkAtOrganization({Key? key, required this.workAtOrganizationInput})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    var workSinceDate = workAtOrganizationInput?.workSinceDate;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Organization(
          organizationInput: workAtOrganizationInput?.organization,
        ),
        const SizedBox(height: 24),
        const FormHeaderText("Angaben zur ehrenamtlicher Tätigkeit"),
        FormBuilderDropdown(
          name: 'category',
          decoration: const InputDecoration(labelText: 'Einsatzgebiet *'),
          validator: FormBuilderValidators.required(context),
          initialValue: workAtOrganizationInput?.organization?.category,
          onSaved: (String? value) => {
            if (value != null)
              {workAtOrganizationInput?.organization?.category = value}
          },
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
                    child: Text(category),
                  ))
              .toList(),
        ),
        TextFormField(
          decoration: const InputDecoration(labelText: 'Funktionsbeschreibung'),
          initialValue: workAtOrganizationInput?.responsibility,
          onSaved: (value) => {workAtOrganizationInput?.responsibility = value},
        ),
        const SizedBox(height: 24),
        const FormText(
          'Wird für diese ehrenamtliche Tätigkeit eine '
          'Aufwandsentschädigung gewährt, die über Auslagenersatz '
          'oder Erstattung der Kosten hinausgeht?',
        ),
        FormBuilderRadioGroup(
            name: 'payment',
            validator: FormBuilderValidators.required(context),
            initialValue: workAtOrganizationInput?.payment,
            onSaved: (bool? value) => {
                  if (value != null) {workAtOrganizationInput?.payment = value}
                },
            options: const [
              FormBuilderFieldOption(value: true, child: Text("Ja")),
              FormBuilderFieldOption(value: false, child: Text("Nein"))
            ]),
        TextFormField(
          decoration: const InputDecoration(
              labelText: 'Arbeitsstunden pro Woche (Durchschnitt) *'),
          initialValue: workAtOrganizationInput?.amountOfWork?.toString(),
          onSaved: (value) => {
            if (value != null)
              {
                workAtOrganizationInput?.amountOfWork = double.parse(value),
                workAtOrganizationInput?.amountOfWorkUnit =
                    AmountOfWorkUnit.hoursPerWeek
              }
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
          initialEntryMode: DatePickerEntryMode.input,
          lastDate: DateTime.now(),
          initialValue: workSinceDate != null
              ? DateFormat('dd.MM.yyyy').parse(workSinceDate)
              : null,
          onSaved: (value) => {
            if (value != null)
              {workSinceDate = DateFormat('dd.MM.yyyy').format(value)}
          },
          validator: FormBuilderValidators.compose([
            FormBuilderValidators.required(context),
            (date) {
              if (date == null) {
                return null;
              } else {
                return date.isAfter(
                        DateTime.now().subtract(const Duration(days: 365 * 2)))
                    ? 'Mindestens seit 2 Jahren'
                    : null;
              }
            }
          ]),
          decoration: const InputDecoration(
              labelText: 'Ehrenamtliche Tätigkeit seit *'),
        ),
        FormBuilderImagePicker(
          name: 'certificate',
          decoration: const InputDecoration(
              labelText: 'Bestätigung der Organisation oder des Vereins'),
          maxImages: 1,
          initialValue: workAtOrganizationInput?.certificate != null
              ? [workAtOrganizationInput?.certificate]
              : null,
          onSaved: (value) => {
            if (value != null && value.isNotEmpty)
              workAtOrganizationInput?.certificate = AttachmentInput(
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
