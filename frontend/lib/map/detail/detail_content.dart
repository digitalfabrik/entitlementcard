import 'package:ehrenamtskarte/graphql/graphql_api.graphql.dart';
import 'package:ehrenamtskarte/home/home_page.dart';
import 'package:ehrenamtskarte/map/map_page.dart';
import 'package:flutter/material.dart';
import 'package:mapbox_gl/mapbox_gl.dart';
import 'package:maps_launcher/maps_launcher.dart';
import 'package:url_launcher/url_launcher.dart';

import 'contact_info_row.dart';

class DetailContent extends StatelessWidget {
  final AcceptingStoreById$Query$PhysicalStore acceptingStore;
  final bool hideShowOnMapButton;

  DetailContent(this.acceptingStore, {this.hideShowOnMapButton = false});

  @override
  Widget build(BuildContext context) {
    final address = acceptingStore.address;
    final contact = acceptingStore.store.contact;
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
                      "Adresse",
                      onTap: () => MapsLauncher.launchQuery(
                          "${address.street}, ${address.postalCode} ${address.location}")),
                  ContactInfoRow(
                    Icons.language,
                    acceptingStore.store.contact.website,
                    "Website",
                    onTap: () => launch(contact.website),
                  ),
                  ContactInfoRow(
                    Icons.phone,
                    contact.telephone,
                    "Telefon",
                    onTap: () => launch("tel:${contact.telephone}"),
                  ),
                  ContactInfoRow(
                    Icons.alternate_email,
                    contact.email,
                    "E-Mail",
                    onTap: () => launch("mailto:${contact.email}"),
                  ),
                ],
              ),
              ...hideShowOnMapButton
                  ? []
                  : [
                      Divider(
                        thickness: 0.7,
                        height: 48,
                        color: Theme.of(context).primaryColorLight,
                      ),
                      ButtonBar(
                        children: [
                          OutlineButton(
                            child: Text("Auf Karte zeigen"),
                            onPressed: () => _showOnMap(context),
                          ),
                        ],
                        alignment: MainAxisAlignment.center,
                      ),
                    ]
            ]));
  }

  void _showOnMap(BuildContext context) {
    HomePage.of(context).goToMap(PhysicalStoreFeatureData(
        acceptingStore.id,
        LatLng(acceptingStore.coordinates.lat, acceptingStore.coordinates.lng),
        acceptingStore.store.category.id));
  }
}
