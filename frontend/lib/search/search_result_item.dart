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

  const SearchResultItem({Key key, this.item, this.coordinates})
      : super(key: key);

  /// Returns the distance between `coordinates` and the physical store,
  /// or `null` if `coordinates` or `item.physicalStore` is `null`
  double get _distance {
    // ignore: avoid_returning_null
    if (coordinates == null || item.physicalStore == null) return null;
    return calcDistance(coordinates.lat, coordinates.lng,
        item.physicalStore.coordinates.lat, item.physicalStore.coordinates.lng);
  }

  static String _formatDistance(double d) {
    if (d < 1) {
      return "${(d * 100).round() * 10} m";
    } else if (d < 10) {
      return "${NumberFormat("##.0", "de").format(d)} km";
    } else {
      return "${NumberFormat("###,###", "de").format(d)} km";
    }
  }

  String get _locationWithDistanceString {
    if (_distance != null) {
      return _formatDistance(_distance);
    } else {
      return "?";
    }
  }

  @override
  Widget build(BuildContext context) {
    var assets = [...categoryAssets];
    final matchedAssets =
        assets.where((element) => element.id == item.category.id);
    final itemCategoryAsset =
        matchedAssets.isNotEmpty ? matchedAssets.first : null;
    final iconPath = itemCategoryAsset?.icon;
    final categoryName = itemCategoryAsset?.name ?? "Unbekannte Kategorie";
    final iconColor = itemCategoryAsset?.color;

    return SafeArea(
      bottom: false,
      top: false,
      child: InkWell(
        onTap: () {
          _openDetailView(context, item.id);
        },
        child: Padding(
            padding: EdgeInsets.all(10),
            child: IntrinsicHeight(
              child: Row(
                children: [
                  MediaQuery.of(context).size.width > 400
                      ? Padding(
                          padding: EdgeInsets.only(right: 10),
                          child: itemCategoryAsset != null
                              ? SvgPicture.asset(iconPath,
                                  width: 40.0, semanticsLabel: categoryName)
                              : Icon(
                                  Icons.info,
                                  size: 40,
                                ),
                        )
                      : Container(),
                  MediaQuery.of(context).size.width <= 400
                      ? Padding(
                          padding: EdgeInsets.only(right: 10),
                          child: VerticalDivider(
                            color: iconColor ??
                                Theme.of(context).colorScheme.primary,
                            thickness: 3,
                          ),
                        )
                      : Padding(padding: EdgeInsets.symmetric(horizontal: 5)),
                  Expanded(
                    child: Column(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            item.name ?? "Akzeptanzstelle",
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: Theme.of(context).textTheme.subtitle2,
                          ),
                          Text(
                            item.description ?? "",
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ]),
                  ),
                  Center(
                    child: Text(
                      _locationWithDistanceString,
                      maxLines: 1,
                    ),
                  ),
                  Container(
                      child: Icon(Icons.keyboard_arrow_right, size: 30.0),
                      height: double.infinity),
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
