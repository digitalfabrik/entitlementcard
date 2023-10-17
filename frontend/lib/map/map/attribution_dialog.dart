import 'package:ehrenamtskarte/map/map/attribution_dialog_item.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher_string.dart';

import '../../util/l10n.dart';

class AttributionDialog extends StatelessWidget {
  const AttributionDialog({super.key});

  @override
  Widget build(BuildContext context) {
    final color = Theme.of(context).colorScheme.primary;
    return SimpleDialog(
      title: Text(context.l10n.map_mapData),
      children: [
        AttributionDialogItem(
          icon: Icons.copyright,
          color: color,
          text: context.l10n.map_osmContributors,
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
          text: 'LBE Bayern',
          onPressed: () {
            launchUrlString('https://www.lbe.bayern.de/', mode: LaunchMode.externalApplication);
          },
        )
      ],
    );
  }
}
