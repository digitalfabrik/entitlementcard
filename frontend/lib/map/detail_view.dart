import 'package:ehrenamtskarte/graphql/graphql_api.graphql.dart';
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
    return Scaffold(
        appBar: AppBar(
          title: Text("Akzeptanzstelle"),
        ),
        body: Query(
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
                AcceptingStoreByIdQuery().parse(result.data).physicalStoresById;
            if (matchingStores.isEmpty ||
                matchingStores.any((element) => element == null)) {
              //return Text('Aktzeptanzstelle nicht gefunden [id: $_acceptingStoreId]');
              //matchingStores.add(mockData());
            }
            //print(matchingStores.first.toJson());
            return buildContent(context, mockData());
          },
        ));
  }

  Widget buildContent(BuildContext context,
      AcceptingStoreById$Query$PhysicalStore acceptingStore) {
    final double sectionSpacing = 16.0;
    return Container(
        padding: const EdgeInsets.all(16.0),
        child: new Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Container(
                  padding: EdgeInsets.only(bottom: 5),
                  child: Text(
                    acceptingStore.store.name,
                    style: Theme
                        .of(context)
                        .textTheme
                        .headline6,
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
      AcceptingStoreById$Query$PhysicalStore acceptingStore) {
    List<TableRow> rows = [];
    if (acceptingStore != null) {
      final address = acceptingStore.address;
      rows.add(_buildTableRow(context, "Adresse",
          "${address.street} ${address.houseNumber}\n${address
              .postalCode} ${address.location} ${address.state}"));
    }
    rows.add(
        _buildTableRow(context, "Tel", acceptingStore.store.contact.telephone));
    rows.add(
        _buildTableRow(context, "E-Mail", acceptingStore.store.contact.email));
    rows.add(
        _buildTableRow(
            context, "Website", acceptingStore.store.contact.website));
    return rows;
  }

  TableRow _buildTableRow(BuildContext context, String category,
      String content) {
    return TableRow(children: [
      Text(category, style: Theme
          .of(context)
          .textTheme
          .bodyText1),
      Text(content)
    ]);
  }
}

AcceptingStoreById$Query$PhysicalStore mockData() {
  final physicalStore = AcceptingStoreById$Query$PhysicalStore();
  physicalStore.store = AcceptingStoreById$Query$PhysicalStore$AcceptingStore();
  physicalStore.store.id = 1;
  physicalStore.store.name = "Store Name";
  physicalStore.address = AcceptingStoreById$Query$PhysicalStore$Address();
  physicalStore.address.location = "München";
  physicalStore.address.postalCode = "81000";
  physicalStore.address.houseNumber = "2";
  physicalStore.address.street = "Examplestr.";
  physicalStore.address.state = "Deutschland";
  physicalStore.store.contact =
      AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Contact();
  physicalStore.store.contact.website = "www.example.com";
  physicalStore.store.contact.telephone = "0175000000";
  physicalStore.store.contact.email = "pw@example.com";
  return physicalStore;
}
