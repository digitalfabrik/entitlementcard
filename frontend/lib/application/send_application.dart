import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:provider/provider.dart';

import '../graphql/graphql_api.dart';
import 'application_model.dart';

class SendApplication extends StatelessWidget {
  final Function(bool) onResult;

  SendApplication({Key key, this.onResult}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final applicationModel =
        Provider.of<ApplicationModel>(context, listen: false);
    applicationModel.createAttachmentStream();
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
          fetchPolicy: FetchPolicy.noCache,
          document: query.document,
          variables: query.getVariablesMap()),
      builder: (result, {fetchMore, refetch}) {
        print("RESULT: $result");
        if (result.isLoading) {
          return Row(
            children: [
              CircularProgressIndicator(),
              SizedBox(
                width: 18,
              ),
              Text('Wird gesendet ...'),
            ],
          );
        } else if (result.isConcrete &&
            result.data != null &&
            parseResult(result.data) == true) {
          onResult(true);
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
                'Antrag gesendet',
                maxLines: null,
                textAlign: TextAlign.center,
              ),
            ],
          );
        } else {
          onResult(false);
          return Row(children: [
            Icon(
              Icons.error_outline,
              size: 42,
              color: Colors.red,
            ),
            SizedBox(
              width: 18,
            ),
            Text('Senden fehlgeschlagen'),
          ]);
        }
      },
    );
  }
}
