import 'package:flutter/material.dart';
import '../util/secrets/secret.dart';
import '../util/secrets/secretLoader.dart';
import 'full_map.dart';

class MapPage extends StatelessWidget {
  MapPage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FullMap();
  }
}
