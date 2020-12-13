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
                  ContactInfoRow(
                      Icons.location_on,
                      "${address.street}\n${address.postalCode} ${address.location}",
                      "Adresse"),
                  ContactInfoRow(Icons.language,
                      acceptingStore.store.contact.website, "Website",
                      isLink: true),
                  ContactInfoRow(Icons.phone,
                      acceptingStore.store.contact.telephone, "Telefon"),
                  ContactInfoRow(Icons.alternate_email,
                      acceptingStore.store.contact.email, "E-Mail"),
                ],
              ),
            ]));
  }
}

class ContactInfoRow extends StatelessWidget {
  final IconData _icon;
  final String _description;
  final String _semanticLabel;
  final bool isLink;

  ContactInfoRow(this._icon, this._description, this._semanticLabel,
      {this.isLink = false});

  @override
  Widget build(BuildContext context) {
    return _description != null && _description.isNotEmpty
        ? Row(children: [
            Padding(
                padding: EdgeInsets.only(top: 6, bottom: 6, right: 16),
                child: ClipOval(
                  child: Container(
                    width: 42,
                    height: 42,
                    child: Icon(
                      _icon,
                      size: 28,
                      semanticLabel: _semanticLabel,
                    ),
                    color: Theme.of(context).primaryColorLight,
                  ),
                )),
            Expanded(
                child: !isLink
                    ? Text(
                        _description,
                      )
                    : InkWell(
                        child: Text(
                          _description,
                          style: Theme.of(context).textTheme.bodyText2.merge(
                              TextStyle(color: Theme.of(context).accentColor)),
                        ),
                        onTap: () {
                          launch(_description);
                        },
                      ))
          ])
        : Container(width: 0, height: 0);
  }
}
