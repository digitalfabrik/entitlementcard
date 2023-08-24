import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class VerificationInfoDialog extends StatelessWidget {
  const VerificationInfoDialog({super.key});

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsModel>(context);
    final localization = buildConfig.localization.identification.verificationCodeScanner;
    return AlertDialog(
      title: Text(localization.infoDialogTitle),
      content: SingleChildScrollView(
        child: ListBody(
          children: const [
            _EnumeratedListItem(
              index: 0,
              child: Text(
                "Scannen Sie den QR-Code, der auf dem \"Ausweisen\"-Tab Ihres Gegenübers angezeigt wird.",
              ),
            ),
            _EnumeratedListItem(index: 1, child: Text('Der QR-Code wird durch eine Server-Anfrage geprüft.')),
            _EnumeratedListItem(
              index: 2,
              child: Text('Gleichen Sie die angezeigten Daten mit einem amtlichen Lichtbildausweis ab.'),
            ),
            SizedBox(height: 12),
            Text(
              'Eine Internetverbindung wird benötigt.',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          child: const Text('Nicht mehr anzeigen'),
          onPressed: () async {
            await settings.setHideVerificationInfo(enabled: true);
            _onDone(context);
          },
        ),
        TextButton(
          child: const Text('Weiter'),
          onPressed: () => _onDone(context),
        )
      ],
    );
  }

  void _onDone(BuildContext context) => Navigator.of(context).pop(true);

  /// Shows a [VerificationInfoDialog].
  /// Returns a future that resolves to true if the user accepted the info,
  /// and to null if the dialog was dismissed.
  static Future<bool?> show(BuildContext context) {
    return showDialog<bool>(
      context: context,
      builder: (_) => const VerificationInfoDialog(),
    );
  }
}

class _EnumeratedListItem extends StatelessWidget {
  final int index;
  final Widget child;

  const _EnumeratedListItem({required this.index, required this.child});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: Theme.of(context).colorScheme.primary,
            child: Text(
              '${index + 1}',
              style: TextStyle(
                color: Theme.of(context).colorScheme.background,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(child: child),
        ],
      ),
    );
  }
}
