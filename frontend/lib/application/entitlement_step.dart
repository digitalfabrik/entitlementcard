import 'package:ehrenamtskarte/application/entitlement_blue.dart';
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:provider/provider.dart';

import 'application_model.dart';
import 'entitlement_gold.dart';

class EntitlementStep extends StatefulWidget {
  final GlobalKey<FormBuilderState> formKey;

  const EntitlementStep({Key key, this.formKey}) : super(key: key);

  @override
  _EntitlementStepState createState() => _EntitlementStepState();
}

class _EntitlementStepState extends State<EntitlementStep> {
  @override
  Widget build(BuildContext context) {
    return Consumer<ApplicationModel>(
        builder: (context, applicationModel, child) {
      if (applicationModel.hasBlueCardApplication()) {
        return EntitlementBlue(
          formKey: widget.formKey,
        );
      } else {
        return EntitlementGold(
          formKey: widget.formKey,
        );
      }
    });
  }
}
