import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:provider/provider.dart';

import '../graphql/graphql_api.dart';
import 'application_model.dart';
import 'entitlement/certificate.dart';
import 'entitlement/entitlement_juleica.dart';
import 'entitlement/entitlement_service_blue.dart';
import 'entitlement/entitlement_work.dart';

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
        switch (applicationModel
            .blueCardApplication.entitlement.blueEntitlementType) {
          case BlueCardEntitlementType.juleica:
            return EntitlementJuleica(
              formKey: widget.formKey,
            );
            break;
          case BlueCardEntitlementType.service:
            return EntitlementServiceBlue(
              formKey: widget.formKey,
            );
            break;
          case BlueCardEntitlementType.standard:
            return EntitlementWork(
              formKey: widget.formKey,
            );
            break;
          default:
            break;
        }
      } else if (applicationModel.hasGoldCardApplication()) {
        switch (applicationModel
            .goldenCardApplication.entitlement.goldenEntitlementType) {
          case GoldenCardEntitlementType.honorByMinisterPresident:
            return Certificate(
              formKey: widget.formKey,
              title: 'Laden Sie hier eine Kopie Ihres Ehrenzeichens des'
                  ' bayerischen Ministerpräsidenten hoch.',
            );
            break;
          case GoldenCardEntitlementType.serviceAward:
            return Certificate(
              formKey: widget.formKey,
              title: 'Laden Sie hier Ihre Kopie des Feuerwehr-Ehrenzeichens des'
                  ' Freistaates Bayern bzw. der Auszeichnung des Bayerischen'
                  ' Innenministeriums für 25- bzw. 40-jährige aktive'
                  ' Dienstzeit hoch.',
            );
            break;
          case GoldenCardEntitlementType.standard:
            // TODO: Handle this case.
            return Container();
            break;
          default:
            break;
        }
      }
      return Container();
    });
  }
}
