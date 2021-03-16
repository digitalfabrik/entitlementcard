import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:form_builder_image_picker/form_builder_image_picker.dart';
import 'package:provider/provider.dart';

import '../application_model.dart';

class Certificate extends StatefulWidget {
  final GlobalKey<FormBuilderState> formKey;
  final String title;

  const Certificate({Key key, this.formKey, this.title}) : super(key: key);

  @override
  _CertificateState createState() => _CertificateState();
}

class _CertificateState extends State<Certificate> {
  @override
  Widget build(BuildContext context) {
    var entitlement = Provider.of<ApplicationModel>(context, listen: false)
        .goldenCardApplication
        .entitlement;
    return FormBuilder(
        key: widget.formKey,
        child: Column(
          children: <Widget>[
            Text(
              widget.title,
              style: Theme.of(context)
                  .textTheme
                  .subtitle1
                  .apply(color: Theme.of(context).hintColor),
            ),
            FormBuilderImagePicker(
              name: 'service_award',
              decoration: InputDecoration(labelText: 'Kopie oder Foto'),
              validator: FormBuilderValidators.required(context),
              maxImages: 1,
              onSaved: (value) => {entitlement.certificate = value.first},
            ),
          ],
        ));
  }
}
