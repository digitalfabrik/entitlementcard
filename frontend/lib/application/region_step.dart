import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:provider/provider.dart';

import '../graphql/graphql_api.dart';
import '../widgets/small_button_spinner.dart';
import 'application_model.dart';
import 'textwidgets/form_header_text.dart';

class RegionStep extends StatefulWidget {
  final GlobalKey<FormBuilderState> formKey;

  const RegionStep({Key key, this.formKey}) : super(key: key);

  @override
  _RegionStepState createState() => _RegionStepState();
}

class _RegionStepState extends State<RegionStep> {
  @override
  Widget build(BuildContext context) {
    final regionsQuery = GetRegionsQuery();
    final applicationModel =
        Provider.of<ApplicationModel>(context, listen: false);
    return Query(
        options: QueryOptions(
            document: regionsQuery.document,
            variables: regionsQuery.getVariablesMap()),
        builder: (result, {fetchMore, refetch}) {
          var regions = result.isLoading || result.hasException
              ? []
              : regionsQuery.parse(result.data)?.regions;
          return FormBuilder(
              key: widget.formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  FormHeaderText(
                      'Sie beantragen die Ehrenamtskarte für den folgenden'
                      ' Landkreis oder kreisfreie Stadt:'),
                  FormBuilderDropdown(
                    name: 'region',
                    validator: FormBuilderValidators.required(context),
                    enabled: !result.isLoading && !result.hasException,
                    onSaved: (value) => {applicationModel.regionId = value},
                    decoration: InputDecoration(
                        labelText: 'Region auswählen',
                        suffixIcon: result.isLoading
                            ? SmallButtonSpinner()
                            : result.hasException
                                ? IconButton(
                                    onPressed: refetch,
                                    icon: Icon(Icons.refresh))
                                : null),
                    items: regions
                        .map((region) => DropdownMenuItem(
                              value: region.id,
                              child: Text('${region.prefix} ${region.name}'),
                            ))
                        .toList(),
                  ),
                ],
              ));
        });
  }
}
