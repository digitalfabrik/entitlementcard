import 'package:flutter/material.dart';

import '../../util/i18n.dart';

class ActivationOverwriteExistingDialog extends StatelessWidget {
  const ActivationOverwriteExistingDialog({super.key});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(t(context).identification_activateCardCurrentDevice, style: TextStyle(fontSize: 18)),
      content: SingleChildScrollView(
        child: ListBody(
          children: <Widget>[
            Text(t(context).identification_activateCardCurrentDeviceRationale),
          ],
        ),
      ),
      actions: <Widget>[
        TextButton(
          child: Text(t(context).common_cancel),
          onPressed: () {
            Navigator.of(context).pop(false);
          },
        ),
        TextButton(
          child: Text(t(context).identification_activate),
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
