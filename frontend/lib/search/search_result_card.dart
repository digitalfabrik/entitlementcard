import 'package:ehrenamtskarte/graphql_gen/schema.graphql.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/map/map_page.dart';
import 'package:ehrenamtskarte/map/preview/models.dart';
import 'package:ehrenamtskarte/store_widgets/accepting_store_summary.dart';
import 'package:ehrenamtskarte/widgets/grouped_list_item.dart';
import 'package:flutter/material.dart';

class SearchResultCard extends StatelessWidget {
  final AcceptingStoreModel store;

  final Input$CoordinatesInput? coordinates;
  final void Function(PhysicalStoreFeatureData)? showOnMap;

  final bool isFirst;
  final bool isLast;

  const SearchResultCard({
    super.key,
    required this.store,
    this.coordinates,
    required this.showOnMap,
    required this.isFirst,
    required this.isLast,
  });

  double? get _distance {
    final storeCoordinates = store.coordinates;
    final currentCoordinates = coordinates;
    if (currentCoordinates == null || storeCoordinates == null) return null;
    return calcDistance(currentCoordinates.lat, currentCoordinates.lng, storeCoordinates.lat, storeCoordinates.lng);
  }

  @override
  Widget build(BuildContext context) {
    final distance = _distance;
    final locationText = distance != null
        ? context.t.search.distanceAway(distance: DistanceText.formatDistance(distance))
        : store.location;
    return GroupedListItem(
      isFirst: isFirst,
      isLast: isLast,
      child: AcceptingStoreSummary(store: store, showOnMap: showOnMap, locationText: locationText),
    );
  }
}
