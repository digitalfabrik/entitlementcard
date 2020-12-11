import 'package:ehrenamtskarte/graphql/graphql_api.graphql.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class DetailContent extends StatelessWidget {
  final AcceptingStoreById$Query$PhysicalStore acceptingStore;

  DetailContent(this.acceptingStore);

  @override
  Widget build(BuildContext context) {
    final address = acceptingStore.address;
    return Container(
        padding: EdgeInsets.symmetric(vertical: 24, horizontal: 18),
        child: new Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                acceptingStore.store.description,
                style: Theme.of(context).textTheme.bodyText1,
              ),
              Divider(
                  thickness: 0.7,
                  height: 48,
                  color: Theme.of(context).primaryColorLight),
              Column(
                children: <Widget>[
                  _buildTableRow(
                      context,
                      Icons.location_on,
                      "${address.street} ${address.houseNumber}\n${address.postalCode} ${address.location}",
                      "Adresse"),
                  _buildTableRow(context, Icons.language,
                      acceptingStore.store.contact.website, "Website",
                      isLink: true),
                  _buildTableRow(context, Icons.phone, "Telefon",
                      acceptingStore.store.contact.telephone),
                  _buildTableRow(context, Icons.alternate_email, "E-Mail",
                      acceptingStore.store.contact.email),
                ],
              ),
            ]));
  }

  Row _buildTableRow(
      BuildContext context, IconData icon, String content, String sematicLabel,
      {bool isLink = false}) {
    return Row(children: [
      Padding(
          padding: EdgeInsets.only(top: 8, bottom: 8, right: 16),
          child: ClipOval(
            child: Container(
              width: 40,
              height: 40,
              child: Icon(
                icon,
                size: 28,
                semanticLabel: sematicLabel,
              ),
              color: Theme.of(context).primaryColorLight,
            ),
          )),
      Align(
          alignment: Alignment.bottomLeft,
          child: !isLink
              ? Text(content)
              : InkWell(
                  child: Text(
                    content,
                    style: Theme.of(context)
                        .textTheme
                        .bodyText2
                        .merge(TextStyle(color: Theme.of(context).accentColor)),
                  ),
                  onTap: () {
                    launch(content);
                  },
                ))
    ]);
  }
}
