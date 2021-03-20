import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:provider/provider.dart';

import '../application_model.dart';
import 'organization.dart';

class EntitlementServiceBlue extends StatelessWidget {
  final GlobalKey<FormBuilderState> formKey;

  const EntitlementServiceBlue({Key key, this.formKey}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final _organization = Provider.of<ApplicationModel>(context, listen: false)
        .blueCardApplication
        .entitlement
        .serviceEntitlement
        .organization;

    return FormBuilder(
        key: formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [Organization(organizationInput: _organization)],
        ));
  }
}
