import 'package:ehrenamtskarte/identification/info_dialog.dart';
import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class ConnectionFailedDialog extends StatelessWidget {
  final String reason;

  const ConnectionFailedDialog({super.key, required this.reason});

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    return InfoDialog(
      title: t.common.connectionFailed,
      icon: Icons.signal_cellular_connected_no_internet_4_bar,
      iconColor: Theme.of(context).colorScheme.onSurface,
      child: Text(reason, style: Theme.of(context).textTheme.bodyMedium),
    );
  }

  static Future<void> show(BuildContext context, String reason) =>
      showDialog(context: context, builder: (_) => ConnectionFailedDialog(reason: reason));
}
