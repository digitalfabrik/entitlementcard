import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/map/map/attribution_dialog_item.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher_string.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class AttributionDialog extends StatelessWidget {
  const AttributionDialog({super.key});

  @override
  Widget build(BuildContext context) {
    final color = Theme.of(context).colorScheme.primary;
    final t = context.t;
    return SimpleDialog(
      title: Text(t.map.mapData),
      children: [
        AttributionDialogItem(
          icon: Icons.copyright,
          color: color,
          text: t.map.osmContributors,
          onPressed: () {
            launchUrlString('https://www.openstreetmap.org/copyright', mode: LaunchMode.externalApplication);
          },
        ),
        AttributionDialogItem(
          icon: Icons.copyright,
          color: color,
          text: 'OpenMapTiles',
          onPressed: () {
            launchUrlString('https://openmaptiles.org/', mode: LaunchMode.externalApplication);
          },
        ),
        AttributionDialogItem(
          icon: Icons.copyright,
          color: color,
          text: 'Natural Earth',
          onPressed: () {
            launchUrlString('https://naturalearthdata.com/', mode: LaunchMode.externalApplication);
          },
        ),
        AttributionDialogItem(
          icon: Icons.copyright,
          color: color,
          text: buildConfig.mapAttribution.text,
          onPressed: () {
            launchUrlString(buildConfig.mapAttribution.url, mode: LaunchMode.externalApplication);
          },
        )
      ],
    );
  }
}
