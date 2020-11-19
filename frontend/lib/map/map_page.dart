import 'package:flutter/material.dart';
import '../util/secrets/secret.dart';
import '../util/secrets/secretLoader.dart';
import 'map.dart';

class MapPage extends StatelessWidget {
  MapPage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Secret>(
        future: SecretLoader(secretPath: "secrets.json").load(),
        builder: (BuildContext context, AsyncSnapshot<Secret> snapshot) {
          if (!snapshot.hasData) {
            return Center(
              child: Text(snapshot.hasData
                  ? "Failed to fetch MapBox API key"
                  : "Fetching MapBox API key …"),
            );
          }
          return FullMap(snapshot.data.mapboxKey);
        },
      );
  }
}
