import 'package:ehrenamtskarte/graphql/graphql_api.graphql.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import '../graphql/graphql_api.dart';

class DetailView extends StatelessWidget {
  int _acceptingStoreId;
  String _storeName;
  int _categoryId;

  DetailView(this._acceptingStoreId, this._storeName, this._categoryId);

  @override
  Widget build(BuildContext context) {
    final byIdQuery = AcceptingStoreByIdQuery(
        variables: AcceptingStoreByIdArguments(
            ids: ParamsInput(ids: [_acceptingStoreId])));
    return Scaffold(
        body: Column(children: <Widget>[
      Container(
          decoration: BoxDecoration(
            color: Theme.of(context).primaryColorLight,
            image: DecorationImage(
                image: AssetImage("assets/detail_headers/mask_header.png"),
                fit: BoxFit.contain,
                alignment: Alignment.topRight),
          ),
          child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                AppBar(
                  leading: new IconButton(
                    icon: new Icon(Icons.arrow_back_ios),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                  backgroundColor: Colors.transparent,
                  elevation: 0.0, //No shadow
                ),
                Padding(
                  padding: const EdgeInsets.only(
                      left: 16, top: 24, right: 16, bottom: 8),
                  child: Text(
                    _storeName,
                    style: Theme.of(context).textTheme.headline6,
                  ),
                )
              ])),
      Query(
        options: QueryOptions(
            documentNode: byIdQuery.document,
            variables: byIdQuery.getVariablesMap()),
        builder: (QueryResult result,
            {VoidCallback refetch, FetchMore fetchMore}) {
          return buildContent(context, mockData());
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
      ),
    ]));
  }

  Widget buildContent(BuildContext context,
      AcceptingStoreById$Query$PhysicalStore acceptingStore) {
    final address = acceptingStore.address;
    return SingleChildScrollView(
        child: Container(
            padding: const EdgeInsets.only(left: 16, top: 8, right: 16),
            child: new Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Divider(
                      thickness: 0.7,
                      height: 48,
                      color: Theme
                          .of(context)
                          .primaryColorLight),
                  Text(
                    "vergünstigter Eintritt € 5,50",
                    style: Theme
                        .of(context)
                        .textTheme
                        .bodyText1,
                  ),
                  Divider(
                      thickness: 0.7,
                      height: 48,
                      color: Theme
                          .of(context)
                          .primaryColorLight),
                  Column(
                    children: <Widget>[
                      _buildTableRow(context, Icons.location_on,
                          "${address.street} ${address.houseNumber}\n${address
                              .postalCode} ${address.location}\n${address
                              .state}"),
                      _buildTableRow(context, Icons.phone,
                          acceptingStore.store.contact.telephone),
                      _buildTableRow(context, Icons.alternate_email,
                          acceptingStore.store.contact.email),
                      _buildTableRow(context, Icons.language,
                          acceptingStore.store.contact.website)
                    ],
                  ),
                ])));
  }

  Row _buildTableRow(BuildContext context, IconData icon, String content) {
    return Row(children: [
      Padding(
          padding: EdgeInsets.only(top: 8, bottom: 8, right: 16),
          child: ClipOval(
            child: Container(
              width: 50,
              height: 50,
              child: Icon(icon, size: 28),
              color: Theme
                  .of(context)
                  .primaryColorLight,
            ),
          )),
      Align(alignment: Alignment.bottomLeft, child: Text(content))
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
