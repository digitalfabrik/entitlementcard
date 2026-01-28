import 'package:ehrenamtskarte/store_widgets/detail/detail_app_bar.dart';
import 'package:ehrenamtskarte/store_widgets/detail/detail_content.dart';
import 'package:ehrenamtskarte/util/color_utils.dart';
import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

import 'package:ehrenamtskarte/map/map_page.dart';
import 'package:ehrenamtskarte/map/preview/models.dart';

class DetailPage extends StatelessWidget {
  final AcceptingStoreModel store;
  final void Function(PhysicalStoreFeatureData)? showOnMap;

  const DetailPage({super.key, required this.store, this.showOnMap});

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final categoryId = store.categoryId;
    final accentColor = getDarkenedColorForCategory(context, categoryId);

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        DetailAppBar(
          storeId: store.id,
          storeName: store.name ?? t.store.acceptingStore,
          categoryId: store.categoryId,
          showFavoriteButton: true,
        ),
        Expanded(
          child: Scaffold(
            body: DetailContent(store, showOnMap: showOnMap, accentColor: accentColor),
          ),
        ),
      ],
    );
  }
}
