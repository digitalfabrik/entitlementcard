import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:provider/provider.dart';

import 'application_model.dart';
import 'entitlement_type_blue.dart';
import 'entitlement_type_gold.dart';

class EntitlementTypeStep extends StatelessWidget {
  final GlobalKey<FormBuilderState> formKey;

  const EntitlementTypeStep({Key key, this.formKey}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<ApplicationModel>(
        builder: (context, applicationModel, child) {
      if (applicationModel.hasBlueCardApplication()) {
        return EntitlementTypeBlue(
          formKey: formKey,
        );
      } else {
        return EntitlementTypeGold(
          formKey: formKey,
        );
      }
    });
  }
}
