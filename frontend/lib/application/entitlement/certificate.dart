import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:form_builder_image_picker/form_builder_image_picker.dart';
import 'package:http/http.dart';
import 'package:http_parser/http_parser.dart';
import 'package:provider/provider.dart';

import '../../graphql/graphql_api.dart';
import '../application_model.dart';
import '../textwidgets/form_text.dart';

class Certificate extends StatelessWidget {
  final GlobalKey<FormBuilderState> formKey;
  final String title;

  const Certificate({Key key, this.formKey, this.title}) : super(key: key);

  Widget build(BuildContext context) {
    var applicationModel =
        Provider.of<ApplicationModel>(context, listen: false);
    var entitlement = applicationModel.goldenCardApplication.entitlement;
    return FormBuilder(
        key: formKey,
        child: Column(
          children: <Widget>[
            FormText(
              title,
            ),
            FormBuilderImagePicker(
              name: 'certificate',
              decoration: InputDecoration(labelText: 'Kopie oder Foto'),
              validator: FormBuilderValidators.required(context),
              maxImages: 1,
              initialValue: entitlement.certificate != null
                  ? [applicationModel.attachment]
                  : [],
              onSaved: (value) => {
                applicationModel.attachment = value.first,
                entitlement.certificate = AttachmentInput(
                    fileName: 'zertifikat.jpg',
                    data: MultipartFile.fromBytes(
                      'certificate',
                      value.first.readAsBytesSync(),
                      filename: 'zertifikat.jpg',
                      contentType: MediaType("image", "jpg"),
                    ))
              },
            ),
          ],
        ));
  }
}
