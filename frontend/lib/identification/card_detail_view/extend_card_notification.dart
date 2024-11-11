import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:url_launcher/url_launcher_string.dart';

class ExtendCardNotification extends StatefulWidget {
  @override
  State<ExtendCardNotification> createState() => _ExtendCardNotificationState();
}

class _ExtendCardNotificationState extends State<ExtendCardNotification> {
  bool _isVisible = true;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).colorScheme;
    final t = context.t;

    return _isVisible
        ? Padding(
            padding: const EdgeInsets.all(8.0),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: theme.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.info, color: theme.primary),
                  SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(t.identification.extendCardNotificationTitle),
                        SizedBox(height: 8),
                        Text(
                          t.identification.extendCardNotificationDescription,
                          textScaler: TextScaler.linear(0.9),
                        ),
                        SizedBox(height: 8),
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: theme.primary,
                            foregroundColor: theme.inversePrimary,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ),
                          onPressed: () => _openApplication(),
                          child: Text(t.identification.extendCard.toUpperCase()),
                        ),
                      ],
                    ),
                  ),
                  SizedBox(width: 16),
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        _isVisible = false;
                      });
                    },
                    child: Icon(Icons.close, size: 16),
                  ),
                ],
              ),
            ),
          )
        : SizedBox.shrink();
  }

  void _openApplication() {
    // TODO add query params with card info
    launchUrlString(buildConfig.applicationUrl, mode: LaunchMode.externalApplication);
  }
}
