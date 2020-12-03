import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import '../graphql/graphql_api.dart';

class DetailView extends StatelessWidget {
  int _acceptingStoreId;

  DetailView(this._acceptingStoreId);

  @override
  Widget build(BuildContext context) {
    final byIdQuery = AcceptingStoreByIdQuery(
        variables: AcceptingStoreByIdArguments(
            ids: ParamsInput(ids: [_acceptingStoreId])));
    return Query(
      options: QueryOptions(
          documentNode: byIdQuery.document,
          variables: byIdQuery.getVariablesMap()),
      builder: (QueryResult result,
          {VoidCallback refetch, FetchMore fetchMore}) {
        if (result.hasException) {
          return Text(result.exception.toString(),
              style: TextStyle(color: Colors.red));
        }

        if (result.loading) {
          return Text('Loading …');
        }
        final matchingStores =
            AcceptingStoreByIdQuery().parse(result.data).acceptingStoreById;
        if (matchingStores.isEmpty) {
          return Text(
              'Aktzeptanzstelle nicht gefunden [id: $_acceptingStoreId]');
        }
        print(matchingStores.first.toJson());
        return buildContent(context, matchingStores.first);
      },
    );
  }

  Widget buildContent(BuildContext context,
      AcceptingStoreById$Query$AcceptingStore acceptingStore) {
    final double sectionSpacing = 16.0;
    return Container(
        padding: const EdgeInsets.all(16.0),
        child: new Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Container(
                  padding: EdgeInsets.only(bottom: 5),
                  child: Text(
                    acceptingStore.name,
                    style: Theme.of(context).textTheme.headline6,
                  )),
              Text(
                "vergünstigter Eintritt € 5,50 vergünstigter Eintritt € 5,50 vergünstigter Eintritt € 5,50",
              ),
              SizedBox(height: sectionSpacing),
              Table(
                columnWidths: {
                  0: FlexColumnWidth(1),
                  1: FlexColumnWidth(4),
                },
                children: _buildTableRows(context, acceptingStore),
              ),
            ]));
  }

  List<TableRow> _buildTableRows(BuildContext context,
      AcceptingStoreById$Query$AcceptingStore acceptingStore) {
    List<TableRow> rows = [];
    if (acceptingStore.physicalStore != null) {
      final address = acceptingStore.physicalStore.address;
      rows.add(_buildTableRow(context, "Adresse",
          "${address.street} ${address.houseNumber}\n${address.postalCode} ${address.location} ${address.state}"));
    }
    rows.add(_buildTableRow(context, "Tel", acceptingStore.contact.telephone));
    rows.add(_buildTableRow(context, "E-Mail", acceptingStore.contact.email));
    rows.add(
        _buildTableRow(context, "Website", acceptingStore.contact.website));
    return rows;
  }

  TableRow _buildTableRow(
      BuildContext context, String category, String content) {
    return TableRow(children: [
      Text(category, style: Theme.of(context).textTheme.bodyText1),
      Text(content)
    ]);
  }
}
