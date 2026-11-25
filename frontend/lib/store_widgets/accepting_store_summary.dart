import 'package:ehrenamtskarte/category_assets.dart';
import 'package:ehrenamtskarte/map/preview/models.dart';
import 'package:ehrenamtskarte/routing.dart';
import 'package:ehrenamtskarte/sentry.dart';
import 'package:ehrenamtskarte/store_widgets/detail/detail_page.dart';
import 'package:ehrenamtskarte/store_widgets/category_label.dart';
import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

import 'package:ehrenamtskarte/map/map_page.dart';

class AcceptingStoreSummary extends StatelessWidget {
  final AcceptingStoreModel store;
  final void Function(PhysicalStoreFeatureData)? showOnMap;

  final String? locationText;

  const AcceptingStoreSummary({super.key, required this.store, required this.showOnMap, this.locationText});

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final theme = Theme.of(context);
    final categories = categoryAssets(context);
    final locationText = this.locationText;
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
