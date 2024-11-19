import 'dart:developer';
import 'dart:io' show Platform;

import 'package:ehrenamtskarte/graphql_gen/graphql_queries/stores/accepting_store_by_id.graphql.dart';
import 'package:ehrenamtskarte/map/map_page.dart';
import 'package:ehrenamtskarte/store_widgets/detail/contact_info_row.dart';
import 'package:ehrenamtskarte/util/color_utils.dart';
import 'package:ehrenamtskarte/util/sanitize_contact_details.dart';
import 'package:flutter/material.dart';
import 'package:maplibre_gl/maplibre_gl.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:url_launcher/url_launcher_string.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class DetailContent extends StatelessWidget {
  final Query$AcceptingStoreById$stores acceptingStore;
  final void Function(PhysicalStoreFeatureData)? showOnMap;
  final Color? accentColor;
  final Color? readableOnAccentColor;

  const DetailContent(
    this.acceptingStore, {
    super.key,
    this.showOnMap,
    this.accentColor,
    this.readableOnAccentColor,
  });

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final theme = Theme.of(context);
    final address = acceptingStore.address;
    final street = address.street;
    final location = '${address.postalCode} ${address.location}';
    final addressString = '${street != null ? '$street\n' : ''}$location';
    final mapQueryString = '${street != null ? '$street, ' : ''}$location';

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
                style: theme.textTheme.bodyLarge,
              ),
              Divider(thickness: 0.7, height: 48, color: theme.primaryColorLight),
            ],
            Column(
              children: <Widget>[
                ContactInfoRow(
                  Icons.location_on,
                  addressString,
                  t.store.address,
                  onTap: () => _launchMap(mapQueryString),
                  iconColor: readableOnAccentColor,
                  iconFillColor: accentColor,
                ),
                if (website != null)
                  ContactInfoRow(
                    Icons.language,
                    prepareWebsiteUrlForDisplay(website),
                    t.store.website,
                    onTap: () =>
                        launchUrlString(prepareWebsiteUrlForLaunch(website), mode: LaunchMode.externalApplication),
                    iconColor: readableOnAccentColor,
                    iconFillColor: accentColor,
                  ),
                if (telephone != null)
                  ContactInfoRow(
                    Icons.phone,
                    telephone,
                    t.store.phone,
                    onTap: () =>
                        launchUrlString('tel:${sanitizePhoneNumber(telephone)}', mode: LaunchMode.externalApplication),
                    iconColor: readableOnAccentColor,
                    iconFillColor: accentColor,
                  ),
                if (email != null)
                  ContactInfoRow(
                    Icons.alternate_email,
                    email,
                    t.store.email,
                    onTap: () => launchUrlString('mailto:${email.trim()}', mode: LaunchMode.externalApplication),
                    iconColor: readableOnAccentColor,
                    iconFillColor: accentColor,
                  ),
              ],
            ),
            if (showOnMap != null) ...[
              Divider(
                thickness: 0.7,
                height: 48,
                color: theme.primaryColorLight,
              ),
              ButtonBar(
                alignment: MainAxisAlignment.center,
                children: [
                  OutlinedButton(
                    child: Text(t.store.showOnMap),
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

  Future<void> _showOnMap(BuildContext context) async {
    // Hint: The promise here is unused
    final showOnMapProp = showOnMap;
    if (showOnMapProp == null) {
      log('Error: showOnMap is null, but button was pressed.');
      return;
    }
    Navigator.of(context).pop();
    showOnMapProp(
      PhysicalStoreFeatureData(
        acceptingStore.id,
        LatLng(acceptingStore.coordinates.lat, acceptingStore.coordinates.lng),
        acceptingStore.store.category.id,
      ),
    );
  }
}
