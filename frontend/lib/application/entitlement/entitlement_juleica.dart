import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:form_builder_image_picker/form_builder_image_picker.dart';
import 'package:http/http.dart';
import 'package:http_parser/http_parser.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../graphql/graphql_api.dart';
import '../application_model.dart';

class EntitlementJuleica extends StatelessWidget {
  final GlobalKey<FormBuilderState> formKey;

  const EntitlementJuleica({Key key, this.formKey}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var entitlement = Provider.of<ApplicationModel>(context, listen: false)
        .blueCardApplication
        .entitlement;
    return FormBuilder(
        key: formKey,
        child: Column(
          children: <Widget>[
            TextFormField(
              decoration: InputDecoration(labelText: "Juleica Kartennummer *"),
              validator: FormBuilderValidators.compose([
                FormBuilderValidators.required(context),
                FormBuilderValidators.numeric(context),
              ]),
              keyboardType: TextInputType.number,
              initialValue: entitlement?.juleicaNumber,
              onSaved: (value) {
                entitlement.juleicaNumber = value;
              },
            ),
            FormBuilderDateTimePicker(
              name: 'expiration_date',
              inputType: InputType.date,
              format: DateFormat('dd.MM.yyyy'),
              firstDate: DateTime.now(),
              validator: FormBuilderValidators.required(context),
              decoration: InputDecoration(
                labelText: 'Gültig bis *',
              ),
              initialValue: entitlement?.juleicaExpirationDate != null
                  ? DateFormat('dd.MM.yyyy')
                      .parse(entitlement.juleicaExpirationDate)
                  : null,
              onSaved: (value) => {
                entitlement.juleicaExpirationDate =
                    DateFormat('dd.MM.yyyy').format(value)
              },
            ),
            FormBuilderImagePicker(
              name: 'juleica_copy',
              decoration: InputDecoration(labelText: 'Bild der Juleica'),
              validator: FormBuilderValidators.required(context),
              maxImages: 1,
              initialValue: entitlement.copyOfJuleica != null
                  ? [entitlement.copyOfJuleica]
                  : [],
              onSaved: (value) => {
                entitlement.copyOfJuleica = AttachmentInput(
                    fileName: 'juleica.jpg',
                    data: MultipartFile.fromBytes(
                      'juleica_copy',
                      value.first.readAsBytesSync(),
                      filename: 'juleica.jpg',
                      contentType: MediaType("image", "jpg"),
                    ))
              },
            ),
          ],
        ));
  }
}
