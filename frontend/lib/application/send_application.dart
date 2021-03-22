import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:provider/provider.dart';

import '../graphql/graphql_api.dart';
import 'application_model.dart';

class SendApplication extends StatefulWidget {
  final Function(bool) onResult;

  SendApplication({Key key, this.onResult}) : super(key: key);

  @override
  _SendApplicationState createState() => _SendApplicationState();
}

class _SendApplicationState extends State<SendApplication> {
  @override
  Widget build(BuildContext context) {
    final applicationModel =
        Provider.of<ApplicationModel>(context, listen: false);
    var query;
    Function parseResult;
    if (applicationModel.hasBlueCardApplication()) {
      var application = AddBlueEakApplicationArguments(
          application: applicationModel.blueCardApplication,
          regionId: applicationModel.regionId);
      query = AddBlueEakApplicationMutation(variables: application);
      parseResult = (data) => query.parse(data).addBlueEakApplication;
    } else if (applicationModel.hasGoldCardApplication()) {
      var application = AddGoldenEakApplicationArguments(
          application: applicationModel.goldenCardApplication,
          regionId: applicationModel.regionId);
      query = AddGoldenEakApplicationMutation(variables: application);
      parseResult = (data) => query.parse(data).addGoldenEakApplication;
    }
    return Query(
      options: QueryOptions(
          document: query.document, variables: query.getVariablesMap()),
      builder: (result, {fetchMore, refetch}) {
        if (result.isLoading) {
          return Row(
            children: [
              CircularProgressIndicator(),
              SizedBox(
                width: 18,
              ),
              Text('Senden ...'),
            ],
          );
        } else if (result.isConcrete &&
            result.data != null &&
            parseResult(result.data) == true) {
          widget.onResult(true);
          return Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Icon(
                Icons.check_circle_outline,
                size: 42,
                color: Colors.green,
              ),
              SizedBox(
                width: 18,
              ),
              Text(
                'Bewerbung gesendet',
                maxLines: null,
                textAlign: TextAlign.center,
              ),
            ],
          );
        } else {
          widget.onResult(false);
          return Row(children: [
            Icon(
              Icons.error_outline,
              size: 42,
              color: Colors.red,
            ),
            SizedBox(
              width: 18,
            ),
            Text('Absenden fehlgeschlagen'),
          ]);
        }
      },
    );
  }
}
