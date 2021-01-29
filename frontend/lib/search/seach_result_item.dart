import 'dart:math';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

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
    return [
      item.physicalStore?.address?.location,
      if (_distance != null) "${_formatDistance(_distance)} entfernt"
    ]
        .where((element) => element != null)
        .join(", ");
  }

  @override
  Widget build(BuildContext context) {
    return ListTile(
        title: Text(
            item.name ?? "Akzeptanzstelle",
            maxLines: 1,
            overflow: TextOverflow.ellipsis
        ),
        subtitle: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
                item.description ?? "",
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            Text(
                _locationWithDistanceString,
                maxLines: 1,
              ),
          ]),
        isThreeLine: true,
        trailing: Container(
            child: Icon(Icons.keyboard_arrow_right, size: 30.0),
            height: double.infinity),
        onTap: () {
          _openDetailView(context, item.id);
        });
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
