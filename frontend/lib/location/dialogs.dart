import 'package:flutter/material.dart';

import '../util/l10n.dart';

class LocationServiceDialog extends StatelessWidget {
  const LocationServiceDialog({super.key});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(context.l10n.location_activateLocationAccess),
      content: Text(context.l10n.location_activateLocationAccessSettings),
      actions: [
        TextButton(child: Text(context.l10n.common_cancel), onPressed: () => Navigator.of(context).pop(false)),
        TextButton(child: Text(context.l10n.common_openSettings), onPressed: () => Navigator.of(context).pop(true))
      ],
    );
  }
}

class RationaleDialog extends StatelessWidget {
  final String _rationale;

  const RationaleDialog({super.key, required String rationale}) : _rationale = rationale;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(context.l10n.location_locationPermission),
      content: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[Text(_rationale), Text(context.l10n.location_askPermissionsAgain)],
      ),
      actions: [
        TextButton(child: Text(context.l10n.location_grantPermission), onPressed: () => Navigator.of(context).pop(true)),
        TextButton(child: Text(context.l10n.common_cancel), onPressed: () => Navigator.of(context).pop(false))
      ],
    );
  }
}
