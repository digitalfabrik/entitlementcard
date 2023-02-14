import 'dart:io' show Platform;

import 'package:ehrenamtskarte/graphql/graphql_api.graphql.dart';
import 'package:ehrenamtskarte/home/home_page.dart';
import 'package:ehrenamtskarte/map/map_page.dart';
import 'package:ehrenamtskarte/store_widgets/detail/contact_info_row.dart';
import 'package:ehrenamtskarte/util/color_utils.dart';
import 'package:ehrenamtskarte/util/sanitize_contact_details.dart';
import 'package:flutter/material.dart';
import 'package:maplibre_gl/mapbox_gl.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:url_launcher/url_launcher_string.dart';

class DetailContent extends StatelessWidget {
  final AcceptingStoreById$Query$PhysicalStore acceptingStore;
  final bool hideShowOnMapButton;
  final Color? accentColor;
  final Color? readableOnAccentColor;

  const DetailContent(
    this.acceptingStore, {
    super.key,
    this.hideShowOnMapButton = false,
    this.accentColor,
    this.readableOnAccentColor,
  });

  @override
  Widget build(BuildContext context) {
    final address = acceptingStore.address;
    final street = address.street;
    final location = "${address.postalCode} ${address.location}";
    final addressString = "${street != null ? "$street\n" : ""}$location";
    final mapQueryString = "${street != null ? "$street, " : ""}$location";

    final contact = acceptingStore.store.contact;
    final currentAccentColor = accentColor;
    final readableOnAccentColor = currentAccentColor == null ? null : getReadableOnColor(currentAccentColor);

    final storeDescription = acceptingStore.store.description;
    final website = contact.website;
    final telephone = contact.telephone;
    final email = contact.email;
    return SingleChildScrollView(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            if (storeDescription != null) ...[
              Text(
                storeDescription,
                style: Theme.of(context).textTheme.bodyText1,
              ),
              Divider(thickness: 0.7, height: 48, color: Theme.of(context).primaryColorLight),
            ],
            Column(
              children: <Widget>[
                ContactInfoRow(
                  Icons.location_on,
                  addressString,
                  "Adresse",
                  onTap: () => _launchMap(mapQueryString),
                  iconColor: readableOnAccentColor,
                  iconFillColor: accentColor,
                ),
                if (website != null)
                  ContactInfoRow(
                    Icons.language,
                    prepareWebsiteUrlForDisplay(website),
                    "Website",
                    onTap: () =>
                        launchUrlString(prepareWebsiteUrlForLaunch(website), mode: LaunchMode.externalApplication),
                    iconColor: readableOnAccentColor,
                    iconFillColor: accentColor,
                  ),
                if (telephone != null)
                  ContactInfoRow(
                    Icons.phone,
                    telephone,
                    "Telefon",
                    onTap: () =>
                        launchUrlString("tel:${sanitizePhoneNumber(telephone)}", mode: LaunchMode.externalApplication),
                    iconColor: readableOnAccentColor,
                    iconFillColor: accentColor,
                  ),
                if (email != null)
                  ContactInfoRow(
                    Icons.alternate_email,
                    email,
                    "E-Mail",
                    onTap: () => launchUrlString("mailto:${email.trim()}", mode: LaunchMode.externalApplication),
                    iconColor: readableOnAccentColor,
                    iconFillColor: accentColor,
                  ),
              ],
            ),
            if (!hideShowOnMapButton) ...[
              Divider(
                thickness: 0.7,
                height: 48,
                color: Theme.of(context).primaryColorLight,
              ),
              ButtonBar(
                alignment: MainAxisAlignment.center,
                children: [
                  OutlinedButton(
                    child: const Text("Auf Karte zeigen"),
                    onPressed: () => _showOnMap(context),
                  ),
                ],
              ),
            ]
          ],
        ),
      ),
    );
  }

  Future<void> _launchMap(String query) async {
    if (Platform.isAndroid) {
      await launchUrl(Uri(scheme: 'geo', host: '0,0', queryParameters: {'q': query}));
    } else if (Platform.isIOS) {
      await launchUrl(Uri.https('maps.apple.com', '/', {'q': query}));
    } else {
      await launchUrl(Uri.https('www.google.com', '/maps/search/', {'api': '1', 'query': query}));
    }
  }

  void _showOnMap(BuildContext context) {
    // Hint: The promise here is unused
    HomePageData.of(context)?.navigateToMapTab(
      PhysicalStoreFeatureData(
        acceptingStore.id,
        LatLng(acceptingStore.coordinates.lat, acceptingStore.coordinates.lng),
        acceptingStore.store.category.id,
      ),
    );
  }
}
