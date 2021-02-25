import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import 'attribution_dialog_item.dart';

class AttributionDialog extends StatelessWidget {
  const AttributionDialog({Key key})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SimpleDialog(
      title: Text('Kartendaten'),
      children: [
        AttributionDialogItem(
          icon: Icons.copyright,
          color: Colors.blue,
          text: 'OpenStreetMap',
          onPressed: () {
            launch("https://www.openstreetmap.org/about/");
          },
        ),
        AttributionDialogItem(
          icon: Icons.copyright,
          color: Colors.blue,
          text: 'OpenMapTiles',
          onPressed: () {
            launch("https://openmaptiles.org/");
          },
        )
      ],
    );
  }
}
