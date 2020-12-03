import 'package:flutter/material.dart';

import 'full_map.dart';

class MapPage extends StatelessWidget {
  MapPage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FullMap((feature) => {
          Scaffold.of(context).showSnackBar(SnackBar(
            content: Text(
                feature["properties"]["k_name"].toString() ?? "Name missing"),
          ))
        });
  }
}
