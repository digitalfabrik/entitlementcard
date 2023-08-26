import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';

import '../../util/i18n.dart';

class ActivationOverwriteExistingDialog extends StatelessWidget {
  const ActivationOverwriteExistingDialog({super.key});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(t(context, 'activateCardCurrentDevice'), style: TextStyle(fontSize: 18)),
      content: SingleChildScrollView(
        child: ListBody(
          children: <Widget>[
            I18nText('activateCardCurrentDeviceRationale'),
          ],
        ),
      ),
      actions: <Widget>[
        TextButton(
          child: I18nText('cancel'),
          onPressed: () {
            Navigator.of(context).pop(false);
          },
        ),
        TextButton(
          child: I18nText('activate'),
          onPressed: () {
            Navigator.of(context).pop(true);
          },
        ),
      ],
    );
  }

  /// Returns true, if the user wants to override the existing device
  static Future<bool> showActivationOverwriteExistingDialog(BuildContext context) async {
    return await showDialog<bool>(
          context: context,
          builder: (context) => ActivationOverwriteExistingDialog(),
        ) ??
        false;
  }
}
