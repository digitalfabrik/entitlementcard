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

class EntitlementStep extends StatelessWidget {
  final GlobalKey<FormBuilderState> formKey;

  const EntitlementStep({Key? key, required this.formKey}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<ApplicationModel>(
        builder: (context, applicationModel, child) {
      if (applicationModel.hasBlueCardApplication() &&
          applicationModel.blueCardApplication.entitlement != null) {
        switch (
            applicationModel.blueCardApplication.entitlement.entitlementType) {
          case BlueCardEntitlementType.juleica:
            return EntitlementJuleica(
              formKey: formKey,
            );
            break;
          case BlueCardEntitlementType.service:
            return EntitlementServiceBlue(
              formKey: formKey,
            );
            break;
          case BlueCardEntitlementType.standard:
            return EntitlementWork(
              formKey: formKey,
              workAtOrganizations:
              Provider
                  .of<ApplicationModel>(context, listen: false)
                  .blueCardApplication
                  .entitlement
                  .workAtOrganizations,
            );
            break;
              default:
                break;
            }
          } else if (applicationModel.hasGoldCardApplication() &&
              applicationModel.goldenCardApplication.entitlement != null) {
            switch (applicationModel
                .goldenCardApplication.entitlement.goldenEntitlementType) {
              case GoldenCardEntitlementType.honorByMinisterPresident:
                return Certificate(
                  formKey: formKey,
                  title: 'Laden Sie hier den Nachweis Ihres Ehrenzeichens des'
                      ' bayerischen Ministerpräsidenten hoch.',
                );
                break;
              case GoldenCardEntitlementType.serviceAward:
            return Certificate(
              formKey: formKey,
              title: 'Laden Sie hier Ihren Nachweis des '
                  'Feuerwehr-Ehrenzeichens des Freistaates Bayern bzw. der '
                  'Auszeichnung des Bayerischen Innenministeriums für 25- bzw. '
                  '40-jährige aktive Dienstzeit hoch.',
            );
            break;
          case GoldenCardEntitlementType.standard:
            return EntitlementWork(
              formKey: formKey,
              workAtOrganizations:
                  Provider.of<ApplicationModel>(context, listen: false)
                      .goldenCardApplication
                      .entitlement
                      .workAtOrganizations,
            );
            break;
          default:
            break;
        }
      }
      return Container();
    });
  }
}
