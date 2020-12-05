import 'package:ehrenamtskarte/map/map/map_with_futures.dart';
import 'package:ehrenamtskarte/map/preview/business_summary.dart';
import 'package:flutter/material.dart';

class MapPage extends StatelessWidget {
  MapPage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
        children: [MapWithFutures(), BusinessSummary("placeholder id")]);
  }
}
