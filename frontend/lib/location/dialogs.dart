import 'package:flutter/material.dart';

import '../util/i18n.dart';

class LocationServiceDialog extends StatelessWidget {
  const LocationServiceDialog({super.key});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(t(context).location_activateLocationAccess),
      content: Text(t(context).location_activateLocationAccessSettings),
      actions: [
        TextButton(child: Text(t(context).common_cancel), onPressed: () => Navigator.of(context).pop(false)),
        TextButton(child: Text(t(context).common_openSettings), onPressed: () => Navigator.of(context).pop(true))
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
      title: Text(t(context).location_locationPermission),
      content: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[Text(_rationale), Text(t(context).location_askPermissionsAgain)],
      ),
      actions: [
        TextButton(child: Text(t(context).location_grantPermission), onPressed: () => Navigator.of(context).pop(true)),
        TextButton(child: Text(t(context).common_cancel), onPressed: () => Navigator.of(context).pop(false))
      ],
    );
  }
}
