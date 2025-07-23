import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class LocationServiceDialog extends StatelessWidget {
  const LocationServiceDialog({super.key});

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    return AlertDialog(
      title: Text(t.location.activateLocationAccess),
      content: Text(t.location.activateLocationAccessSettings),
      actions: [
        TextButton(child: Text(t.common.cancel), onPressed: () => Navigator.of(context).pop(false)),
        TextButton(child: Text(t.common.openSettings), onPressed: () => Navigator.of(context).pop(true)),
      ],
    );
  }
}

class RationaleDialog extends StatelessWidget {
  final String _rationale;

  const RationaleDialog({super.key, required String rationale}) : _rationale = rationale;

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final theme = Theme.of(context);
    return AlertDialog(
      title: Text(t.location.locationPermission),
      content: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(_rationale, style: theme.textTheme.bodyLarge),
          Text(t.location.askPermissionsAgain, style: theme.textTheme.bodyLarge),
        ],
      ),
      actions: [
        TextButton(child: Text(t.location.grantPermission), onPressed: () => Navigator.of(context).pop(true)),
        TextButton(child: Text(t.common.cancel), onPressed: () => Navigator.of(context).pop(false)),
      ],
    );
  }
}
