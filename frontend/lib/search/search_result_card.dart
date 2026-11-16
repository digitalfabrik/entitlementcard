import 'package:ehrenamtskarte/category_assets.dart';
import 'package:ehrenamtskarte/graphql_gen/schema.graphql.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/map/map_page.dart';
import 'package:ehrenamtskarte/map/preview/models.dart';
import 'package:ehrenamtskarte/routing.dart';
import 'package:ehrenamtskarte/sentry.dart';
import 'package:ehrenamtskarte/store_widgets/accepting_store_summary.dart';
import 'package:ehrenamtskarte/store_widgets/detail/detail_page.dart';
import 'package:flutter/material.dart';

class SearchResultCard extends StatelessWidget {
  final AcceptingStoreModel store;

  final Input$CoordinatesInput? coordinates;
  final void Function(PhysicalStoreFeatureData)? showOnMap;

  final bool isFirst;

  const SearchResultCard({
    super.key,
    required this.store,
    this.coordinates,
    required this.showOnMap,
    required this.isFirst,
  });

  double? get _distance {
    final storeCoordinates = store.coordinates;
    final currentCoordinates = coordinates;
    if (currentCoordinates == null || storeCoordinates == null) return null;
    return calcDistance(currentCoordinates.lat, currentCoordinates.lng, storeCoordinates.lat, storeCoordinates.lng);
  }

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final distance = _distance;
    final location = store.location;
    final locationText = distance != null
        ? t.search.distanceAway(distance: DistanceText.formatDistance(distance))
        : location;

    final categories = categoryAssets(context);
    final category = store.categoryId < categories.length ? categories[store.categoryId] : null;
    final categoryName = category?.shortName ?? t.store.unknownCategory;

    final borderSide = BorderSide(color: colorScheme.outlineVariant);
    final ShapeBorder shape = isFirst
        ? RoundedRectangleBorder(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
            side: borderSide,
          )
        : Border(left: borderSide, right: borderSide, bottom: borderSide);

    return SafeArea(
      top: false,
      bottom: false,
      child: Material(
        color: colorScheme.surface,
        shape: shape,
        clipBehavior: Clip.antiAlias,
        // Merge the contents so screen readers announce the whole entry as a single button.
        child: MergeSemantics(
          child: InkWell(
            customBorder: shape,
            onTap: () => _openDetailView(context),
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 8, 16),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _CategoryLabel(name: categoryName),
                        const SizedBox(height: 8),
                        Text(
                          store.name ?? t.store.acceptingStore,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: theme.textTheme.titleSmall?.apply(color: colorScheme.onSurface),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          store.description ?? t.store.noDescriptionAvailable,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: theme.textTheme.bodyLarge?.apply(color: theme.hintColor),
                        ),
                        if (locationText != null) ...[
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              Icon(Icons.location_on_outlined, size: 20, color: theme.hintColor),
                              const SizedBox(width: 4),
                              Expanded(
                                child: Text(
                                  locationText,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: theme.textTheme.bodyMedium?.apply(color: theme.hintColor),
                                ),
                              ),
                            ],
                          ),
                        ],
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

class _CategoryLabel extends StatelessWidget {
  final String name;

  const _CategoryLabel({required this.name});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(color: colorScheme.surfaceContainerHighest, borderRadius: BorderRadius.circular(4)),
      child: Text(
        name.toUpperCase(),
        // Screen readers would spell out the upper case text letter by letter.
        semanticsLabel: name,
        style: theme.textTheme.bodySmall?.copyWith(
          color: theme.hintColor,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
