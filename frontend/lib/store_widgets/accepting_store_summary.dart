import 'dart:math';

import 'package:ehrenamtskarte/category_assets.dart';
import 'package:ehrenamtskarte/map/preview/models.dart';
import 'package:ehrenamtskarte/routing.dart';
import 'package:ehrenamtskarte/sentry.dart';
import 'package:ehrenamtskarte/store_widgets/detail/detail_page.dart';
import 'package:ehrenamtskarte/store_widgets/category_label.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

import 'package:ehrenamtskarte/map/map_page.dart';

class AcceptingStoreSummary extends StatelessWidget {
  final AcceptingStoreModel store;
  final void Function(PhysicalStoreFeatureData)? showOnMap;

  const AcceptingStoreSummary({super.key, required this.store, required this.showOnMap});

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final theme = Theme.of(context);
    final categories = categoryAssets(context);
    final category = store.categoryId < categories.length ? categories[store.categoryId] : null;

    return SafeArea(
      top: false,
      bottom: false,
      child: MergeSemantics(
        child: InkWell(
          onTap: () => _openDetailView(context),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 8, 16),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      CategoryLabel(name: category?.shortName ?? t.store.unknownCategory),
                      const SizedBox(height: 8),
                      Text(
                        store.name ?? t.store.acceptingStore,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: theme.textTheme.titleSmall?.apply(color: theme.colorScheme.onSurface),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        store.description ?? t.store.noDescriptionAvailable,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: theme.textTheme.bodyLarge?.apply(color: theme.hintColor),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                ExcludeSemantics(child: Icon(Icons.chevron_right, color: theme.hintColor)),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _openDetailView(BuildContext context) {
    final physicalStoreId = store.physicalStoreId;
    if (physicalStoreId == null) {
      reportError('Store "${store.name}" has no physical store id', StackTrace.current);
      return;
    }
    Navigator.of(context, rootNavigator: true).push(
      AppRoute(
        builder: (context) => DetailPage(store: store, showOnMap: showOnMap),
      ),
    );
  }
}

class DistanceText extends StatelessWidget {
  final double distance;

  const DistanceText({super.key, required this.distance});

  static String formatDistance(double d) {
    if (d < 1) {
      return '${(d * 100).round() * 10} m';
    } else if (d < 10) {
      return '${NumberFormat('##.0', 'de').format(d)} km';
    } else {
      return '${NumberFormat('###,###', 'de').format(d)} km';
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Center(
      child: Text(
        formatDistance(distance),
        maxLines: 1,
        style: theme.textTheme.bodyLarge?.apply(color: theme.hintColor),
      ),
    );
  }
}

// from https://www.movable-type.co.uk/scripts/latlong.html
double calcDistance(double lat1, double lng1, double lat2, double lng2) {
  const R = 6371; // kilometers
  final phi1 = lat1 * pi / 180; // φ, λ in radians
  final phi2 = lat2 * pi / 180;
  final deltaPhi = (lat2 - lat1) * pi / 180;
  final deltaLambda = (lng2 - lng1) * pi / 180;

  final a = sin(deltaPhi / 2) * sin(deltaPhi / 2) + cos(phi1) * cos(phi2) * sin(deltaLambda / 2) * sin(deltaLambda / 2);
  final c = 2 * atan2(sqrt(a), sqrt(1 - a));

  return R * c; // in metres
}
