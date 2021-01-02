import 'package:flutter/material.dart';

import 'map/map_with_futures.dart';
import 'preview/accepting_store_summary.dart';

class MapPage extends StatefulWidget {
  MapPage({Key key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _MapPageState();
  }
}

class _MapPageState extends State<MapPage> {
  int selectedAcceptingStoreId;

  @override
  Widget build(BuildContext context) {
    return Stack(
        children: [
      MapWithFutures(
        onFeatureClick: (feature) {
          var id = feature["properties"]["id"];
          setState(() => selectedAcceptingStoreId = (id is int) ? id : null);
        },
        onNoFeatureClick: () => setState(() => selectedAcceptingStoreId = null),
        onFeatureClickLayerFilter: ["physical_stores"],
      ),
      AnimatedSwitcher(
          duration: Duration(milliseconds: 200),
          transitionBuilder: (child, animation) =>
              FadeTransition(opacity: animation, child: child),
          child: selectedAcceptingStoreId != null
              ? AcceptingStoreSummary(selectedAcceptingStoreId,
                  key: ValueKey(selectedAcceptingStoreId))
              : null),
    ].where((element) => element != null).toList(growable: false));
  }
}
