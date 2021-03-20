import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:provider/provider.dart';

import '../../graphql/graphql_api.dart';
import '../application_model.dart';
import 'organization.dart';

class EntitlementServiceBlue extends StatefulWidget {
  final GlobalKey<FormBuilderState> formKey;

  const EntitlementServiceBlue({Key key, this.formKey}) : super(key: key);

  @override
  _EntitlementServiceBlueState createState() => _EntitlementServiceBlueState();
}

class _EntitlementServiceBlueState extends State<EntitlementServiceBlue> {
  OrganizationInput _organization;

  @override
  Widget build(BuildContext context) {
    _organization = Provider.of<ApplicationModel>(context, listen: false)
        .blueCardApplication
        .entitlement
        .serviceEntitlement
        .organization;

    return FormBuilder(
        key: widget.formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [Organization(organizationInput: _organization)],
        ));
  }
}
