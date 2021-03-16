import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';

import '../../graphql/graphql_api.dart';
import 'organization.dart';
import 'organization_divider.dart';

class EntitlementServiceBlue extends StatefulWidget {
  final GlobalKey<FormBuilderState> formKey;

  const EntitlementServiceBlue({Key key, this.formKey}) : super(key: key);

  @override
  _EntitlementServiceBlueState createState() => _EntitlementServiceBlueState();
}

class _EntitlementServiceBlueState extends State<EntitlementServiceBlue> {
  final List<OrganizationInput> _organizations = <OrganizationInput>[];

  @override
  Widget build(BuildContext context) {
    //TODO
    // _organizations = Provider.of<ApplicationModel>(context, listen: false)
    //     .blueCardApplication.entitlement.serviceEntitlement
    //     .organizationInput;

    if (_organizations.isEmpty) {
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
                _organizations.length * 2 - 1,
                (index) => index.isEven
                    ? Organization(
                        organizationInput: _organizations[index ~/ 2])
                    : OrganizationDivider(
                        title: "Organisation ${_organizations.length}",
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
    _organizations.add(OrganizationInput(
        contact: OrganizationContactInput(
            email: null, telephone: null, hasGivenPermission: null, name: null),
        name: null));
  }

  _removeOrganisation() {
    _organizations.removeLast();
  }
}
