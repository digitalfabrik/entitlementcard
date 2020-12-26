import 'package:ehrenamtskarte/map/map/map_with_futures.dart';
import 'package:ehrenamtskarte/map/preview/accepting_store_summary.dart';
import 'package:flutter/material.dart';

class MapPage extends StatefulWidget {
  MapPage({Key key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _MapPageState();
  }

  void showAcceptingStore(int physicalStoreId) {
    // TODO implement
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
          setState(
              () => this.selectedAcceptingStoreId = (id is int) ? id : null);
        },
        onNoFeatureClick: () =>
            setState(() => this.selectedAcceptingStoreId = null),
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
