import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';

import '../../graphql/graphql_api.dart';
import 'organization_divider.dart';
import 'work_at_organization.dart';

class EntitlementWork extends StatefulWidget {
  final GlobalKey<FormBuilderState> formKey;
  final List<WorkAtOrganizationInput> workAtOrganizations;

  const EntitlementWork({Key? key, required this.formKey, required this.workAtOrganizations})
      : super(key: key);

  @override
  _EntitlementWorkState createState() => _EntitlementWorkState();
}

class _EntitlementWorkState extends State<EntitlementWork> {
  @override
  Widget build(BuildContext context) {
    if (widget.workAtOrganizations.isEmpty) {
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
                widget.workAtOrganizations.length * 2 - 1,
                (index) => index.isEven
                    ? WorkAtOrganization(
                        workAtOrganizationInput:
                            widget.workAtOrganizations[index ~/ 2])
                    : OrganizationDivider(
                        title:
                            "Organisation ${widget.workAtOrganizations.length}",
                        onOrganisationDeleted: () =>
                            setState(_removeOrganisation),
                      ),
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => setState(_addOrganisation),
              child: const Text('Weitere Organisation hinzufügen'),
            ),
            const SizedBox(height: 24),
          ],
        ));
  }

  _addOrganisation() {
    widget.workAtOrganizations.add(WorkAtOrganizationInput(
        responsibility: null,
        amountOfWork: null,
        amountOfWorkUnit: null,
        certificate: null,
        organization: OrganizationInput(
            category: null,
            website: null,
            contact: OrganizationContactInput(
                email: null,
                telephone: null,
                hasGivenPermission: null,
                name: null),
            name: null,
            address: AddressInput(
              location: null,
              houseNumber: null,
              street: null,
              postalCode: null,
            )),
        workSinceDate: null,
        payment: null));
  }

  _removeOrganisation() {
    widget.workAtOrganizations.removeLast();
  }
}
