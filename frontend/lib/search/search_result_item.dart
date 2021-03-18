import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:intl/intl.dart';

import '../category_assets.dart';
import '../graphql/graphql_api.dart';
import '../map/detail/detail_view.dart';

class SearchResultItem extends StatelessWidget {
  final AcceptingStoresSearch$Query$AcceptingStore item;
  final CoordinatesInput coordinates;
  final double wideDepictionThreshold;

  const SearchResultItem(
      {Key key, this.item, this.coordinates, this.wideDepictionThreshold = 400})
      : super(key: key);

  /// Returns the distance between `coordinates` and the physical store,
  /// or `null` if `coordinates` or `item.physicalStore` is `null`
  double get _distance {
    // ignore: avoid_returning_null
    if (coordinates == null || item.physicalStore == null) return null;
    return calcDistance(coordinates.lat, coordinates.lng,
        item.physicalStore.coordinates.lat, item.physicalStore.coordinates.lng);
  }

  @override
  Widget build(BuildContext context) {
    final itemCategoryAsset = item.categoryId < categoryAssets.length
        ? categoryAssets[item.categoryId]
        : null;
    final categoryName = itemCategoryAsset?.name ?? "Unbekannte Kategorie";
    final categoryColor = itemCategoryAsset?.color;

    final useWideDepiction = MediaQuery.of(context).size.width > 400;

    return SafeArea(
      bottom: false,
      top: false,
      child: InkWell(
        onTap: () {
          _openDetailView(context, item.id);
        },
        child: Padding(
            padding: EdgeInsets.symmetric(vertical: 16),
            child: IntrinsicHeight(
              child: Row(
                children: [
                  if (useWideDepiction)
                    CategoryIconIndicator(
                      svgIconPath: itemCategoryAsset?.icon,
                      categoryName: categoryName,
                    )
                  else
                    CategoryColorIndicator(categoryColor: categoryColor),
                  StoreTextOverview(
                    item: item,
                    showTownName: _distance == null,
                  ),
                  Padding(
                      padding: EdgeInsets.symmetric(horizontal: 8),
                      child: Row(
                        children: [
                          if (_distance != null)
                            DistanceText(distance: _distance),
                          Container(
                              child: Icon(Icons.keyboard_arrow_right,
                                  size: 30.0,
                                  color: Theme.of(context).disabledColor),
                              height: double.infinity),
                        ],
                      ))
                ],
              ),
            )),
      ),
    );
  }

  void _openDetailView(BuildContext context, int acceptingStoreId) {
    Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => DetailView(acceptingStoreId),
        ));
  }
}

class CategoryIconIndicator extends StatelessWidget {
  final String svgIconPath;
  final String categoryName;

  const CategoryIconIndicator({Key key, this.svgIconPath, this.categoryName})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16),
      child: svgIconPath != null
          ? SvgPicture.asset(svgIconPath,
              width: 30, semanticsLabel: categoryName ?? "Unbekannte Kategorie")
          : Icon(
              Icons.info,
              size: 30,
            ),
    );
  }
}

class CategoryColorIndicator extends StatelessWidget {
  final Color categoryColor;

  const CategoryColorIndicator({Key key, this.categoryColor}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 8),
      child: VerticalDivider(
        color: categoryColor ?? Theme.of(context).colorScheme.primary,
        thickness: 3,
      ),
    );
  }
}

class StoreTextOverview extends StatelessWidget {
  final AcceptingStoresSearch$Query$AcceptingStore item;
  final bool showTownName;

  const StoreTextOverview(
      {Key key, @required this.item, this.showTownName = false})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(item.name ?? "Akzeptanzstelle",
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: Theme.of(context).textTheme.bodyText1),
            SizedBox(height: 4),
            Text(item.description ?? "",
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: Theme.of(context).textTheme.bodyText2),
            if (showTownName && item.physicalStore?.address?.location != null)
              Text(item.physicalStore?.address?.location,
                  maxLines: 1, overflow: TextOverflow.ellipsis)
          ]),
    );
  }
}

class DistanceText extends StatelessWidget {
  final double distance;

  const DistanceText({Key key, @required this.distance}) : super(key: key);

  static String _formatDistance(double d) {
    if (d < 1) {
      return "${(d * 100).round() * 10} m";
    } else if (d < 10) {
      return "${NumberFormat("##.0", "de").format(d)} km";
    } else {
      return "${NumberFormat("###,###", "de").format(d)} km";
    }
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(_formatDistance(distance),
          maxLines: 1, style: Theme.of(context).textTheme.bodyText2),
    );
  }
}

// from https://www.movable-type.co.uk/scripts/latlong.html
double calcDistance(double lat1, double lng1, double lat2, double lng2) {
  final R = 6371; // kilometers
  final phi1 = lat1 * pi / 180; // φ, λ in radians
  final phi2 = lat2 * pi / 180;
  final deltaPhi = (lat2 - lat1) * pi / 180;
  final deltaLambda = (lng2 - lng1) * pi / 180;

  final a = sin(deltaPhi / 2) * sin(deltaPhi / 2) +
      cos(phi1) * cos(phi2) * sin(deltaLambda / 2) * sin(deltaLambda / 2);
  final c = 2 * atan2(sqrt(a), sqrt(1 - a));

  return R * c; // in metres
}
