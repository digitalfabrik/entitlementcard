import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import 'attribution_dialog_item.dart';

class AttributionDialog extends StatelessWidget {
  const AttributionDialog({Key? key})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    var color = Theme.of(context).colorScheme.primary;
    return SimpleDialog(
      title: const Text('Kartendaten'),
      children: [
        AttributionDialogItem(
          icon: Icons.copyright,
          color: color,
          text: 'OpenStreetMap Mitwirkende',
          onPressed: () {
            launch("https://www.openstreetmap.org/copyright");
          },
        ),
        AttributionDialogItem(
          icon: Icons.copyright,
          color: color,
          text: 'OpenMapTiles',
          onPressed: () {
            launch("https://openmaptiles.org/");
          },
        ),
        AttributionDialogItem(
          icon: Icons.copyright,
          color: color,
          text: 'Natural Earth',
          onPressed: () {
            launch("https://naturalearthdata.com/");
          },
        ),
        AttributionDialogItem(
          icon: Icons.copyright,
          color: color,
          text: 'LBE Bayern',
          onPressed: () {
            launch("https://www.lbe.bayern.de/");
          },
        )
      ],
    );
  }
}
