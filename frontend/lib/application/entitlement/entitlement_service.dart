import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:provider/provider.dart';

import '../application_model.dart';

class EntitlementService extends StatefulWidget {
  final GlobalKey<FormBuilderState> formKey;

  const EntitlementService({Key key, this.formKey}) : super(key: key);

  @override
  _EntitlementServiceState createState() => _EntitlementServiceState();
}

class _EntitlementServiceState extends State<EntitlementService> {
  @override
  Widget build(BuildContext context) {
    var entitlement = Provider.of<ApplicationModel>(context, listen: false)
        .blueCardApplication
        .entitlement;
    return FormBuilder(
        key: widget.formKey,
        child: Column(
          children: <Widget>[],
        ));
  }
}
