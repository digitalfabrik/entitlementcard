import 'package:ehrenamtskarte/map/map/attribution_dialog_item.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher_string.dart';

class AttributionDialog extends StatelessWidget {
  const AttributionDialog({super.key});

  @override
  Widget build(BuildContext context) {
    final color = Theme.of(context).colorScheme.primary;
    return SimpleDialog(
      title: const Text("Kartendaten"),
      children: [
        AttributionDialogItem(
          icon: Icons.copyright,
          color: color,
          text: "OpenStreetMap Mitwirkende",
          onPressed: () {
            launchUrlString('https://www.openstreetmap.org/copyright', mode: LaunchMode.externalApplication);
          },
        ),
        AttributionDialogItem(
          icon: Icons.copyright,
          color: color,
          text: "OpenMapTiles",
          onPressed: () {
            launchUrlString('https://openmaptiles.org/', mode: LaunchMode.externalApplication);
          },
        ),
        AttributionDialogItem(
          icon: Icons.copyright,
          color: color,
          text: "Natural Earth",
          onPressed: () {
            launchUrlString('https://naturalearthdata.com/', mode: LaunchMode.externalApplication);
          },
        ),
        AttributionDialogItem(
          icon: Icons.copyright,
          color: color,
          text: "LBE Bayern",
          onPressed: () {
            launchUrlString('https://www.lbe.bayern.de/', mode: LaunchMode.externalApplication);
          },
        )
      ],
    );
  }
}
