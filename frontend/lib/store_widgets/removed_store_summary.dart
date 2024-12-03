import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/routing.dart';
import 'package:ehrenamtskarte/store_widgets/category_indicator.dart';
import 'package:ehrenamtskarte/store_widgets/detail/detail_app_bar.dart';
import 'package:ehrenamtskarte/store_widgets/removed_store_content.dart';

class RemovedStoreSummary extends StatelessWidget {
  final int storeId;
  final String storeName;
  final int categoryId;

  const RemovedStoreSummary({
    super.key,
    required this.storeId,
    required this.storeName,
    required this.categoryId,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final t = context.t;
    return SafeArea(
      bottom: false,
      top: false,
      child: InkWell(
        onTap: () {
          _openDetailView(context);
        },
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: Row(
            children: [
              CategoryIndicator(categoryId: categoryId),
              Expanded(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      storeName,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.bodyLarge,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      t.store.acceptingStoreNotAvailable,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.bodyLarge?.apply(color: Colors.redAccent),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8),
                child: SizedBox(
                  height: double.infinity,
                  child: Icon(Icons.keyboard_arrow_right, size: 30.0, color: theme.disabledColor),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _openDetailView(BuildContext context) {
    Navigator.of(context, rootNavigator: true).push(
      AppRoute(
        builder: (context) => Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            DetailAppBar(
              storeId: storeId,
              storeName: storeName,
              categoryId: categoryId,
              showFavoriteButton: false,
            ),
            RemovedStoreContent(
              storeId: storeId,
            ),
          ],
        ),
      ),
    );
  }
}
