import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:provider/provider.dart';

import '../../graphql/graphql_api.dart';
import '../application_model.dart';
import 'organization_divider.dart';
import 'work_at_organization.dart';

class EntitlementWork extends StatefulWidget {
  final GlobalKey<FormBuilderState> formKey;

  const EntitlementWork({Key key, this.formKey}) : super(key: key);

  @override
  _EntitlementWorkState createState() => _EntitlementWorkState();
}

class _EntitlementWorkState extends State<EntitlementWork> {
  List<WorkAtOrganizationInput> _workAtOrganizations;

  @override
  Widget build(BuildContext context) {
    _workAtOrganizations = Provider.of<ApplicationModel>(context, listen: false)
        .blueCardApplication
        .entitlement
        .workAtOrganizations;
    if (_workAtOrganizations.isEmpty) {
      _addOrganisation();
    }
    return FormBuilder(
        key: widget.formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: List<Widget>.generate(
                _workAtOrganizations.length * 2 - 1,
                    (index) =>
                index.isEven
                    ? WorkAtOrganization(
                    workAtOrganizationInput:
                    _workAtOrganizations[index ~/ 2])
                    : OrganizationDivider(
                  title: "Organisation ${_workAtOrganizations.length}",
                  onOrganisationDeleted: () =>
                      setState(_removeOrganisation),
                ),
              ),
            ),
            SizedBox(
              height: 24,
            ),
            TextButton(
                onPressed: () => setState(_addOrganisation),
                child: Text('Weitere Organisation hinzufügen'),
                style: TextButton.styleFrom(
                  primary: Theme.of(context).colorScheme.onPrimary,
                  backgroundColor: Theme.of(context).primaryColor,
                  padding: EdgeInsets.all(12),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.all(Radius.circular(4))),
                )),
            SizedBox(
              height: 24,
            ),
          ],
        ));
  }

  _addOrganisation() {
    _workAtOrganizations.add(WorkAtOrganizationInput(
        amountOfWork: null,
        amountOfWorkUnit: null,
        certificate: null,
        organization: OrganizationInput(
            contact: OrganizationContactInput(
                email: null,
                telephone: null,
                hasGivenPermission: null,
                name: null),
            name: null)));
  }

  _removeOrganisation() {
    _workAtOrganizations.removeLast();
  }
}
