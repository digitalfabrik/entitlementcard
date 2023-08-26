import 'package:flutter/material.dart';
import 'package:flutter_i18n/widgets/I18nText.dart';

class LocationServiceDialog extends StatelessWidget {
  const LocationServiceDialog({super.key});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: I18nText('activateLocationAccess'),
      content: I18nText('activateLocationAccessSettings'),
      actions: [
        TextButton(child: I18nText('cancel'), onPressed: () => Navigator.of(context).pop(false)),
        TextButton(child: I18nText('openSettings'), onPressed: () => Navigator.of(context).pop(true))
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
      title: I18nText('locationPermission'),
      content: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[Text(_rationale), I18nText('askPermissionsAgain')],
      ),
      actions: [
        TextButton(child: I18nText('grantPermission'), onPressed: () => Navigator.of(context).pop(true)),
        TextButton(child: I18nText('cancel'), onPressed: () => Navigator.of(context).pop(false))
      ],
    );
  }
}
