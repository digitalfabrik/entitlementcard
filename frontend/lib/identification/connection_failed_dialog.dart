import 'package:ehrenamtskarte/widgets/custom_alert_dialog.dart';
import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class ConnectionFailedDialog extends StatelessWidget {
  final String reason;

  const ConnectionFailedDialog({super.key, required this.reason});

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    return CustomAlertDialog(
      title: t.common.connectionFailed,
      icon: Icons.signal_cellular_connected_no_internet_4_bar,
      iconColor: Theme.of(context).colorScheme.onSurface,
      message: reason,
    );
  }

  static Future<void> show(BuildContext context, String reason) =>
      showDialog(context: context, builder: (_) => ConnectionFailedDialog(reason: reason));
}
