import 'package:ehrenamtskarte/map/map/map_with_futures.dart';
import 'package:ehrenamtskarte/map/preview/business_summary.dart';
import 'package:flutter/material.dart';

class MapPage extends StatefulWidget {
  MapPage({Key key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _MapPageState();
  }
}

class _MapPageState extends State<MapPage> {
  int selectedBusinessId;

  @override
  Widget build(BuildContext context) {
    return Stack(
        children: [
      MapWithFutures(
        onFeatureClick: (feature) {
          var id = feature["properties"]["id"];
          setState(() => this.selectedBusinessId = (id is int) ? id : null);
        },
        onNoFeatureClick: () => setState(() => this.selectedBusinessId = null),
        onFeatureClickLayerFilter: ["accepting_stores"],
      ),
      AnimatedSwitcher(
          duration: Duration(milliseconds: 200),
          transitionBuilder: (child, animation) =>
              FadeTransition(opacity: animation, child: child),
          child: selectedBusinessId != null
              ? BusinessSummary(selectedBusinessId,
                  key: ValueKey(selectedBusinessId))
              : null),
    ].where((element) => element != null).toList(growable: false));
  }
}
