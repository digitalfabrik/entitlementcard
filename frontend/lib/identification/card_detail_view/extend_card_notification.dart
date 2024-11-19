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
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    final t = context.t;

    return _isVisible
        ? Padding(
            padding: const EdgeInsets.all(8.0),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: colorScheme.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.info, color: colorScheme.primary),
                  SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          t.identification.extendCardNotificationTitle,
                          style: textTheme.bodyLarge,
                        ),
                        SizedBox(height: 8),
                        Text(
                          t.identification.extendCardNotificationDescription,
                          style: textTheme.bodyMedium,
                        ),
                        SizedBox(height: 8),
                        FilledButton(
                          style: ButtonStyle(
                              backgroundColor: MaterialStateColor.resolveWith((states) => colorScheme.primary),
                              elevation: MaterialStateProperty.resolveWith<double>(
                                (states) => states.contains(MaterialState.pressed) ? 8 : 2,
                              ),
                              shape: MaterialStateProperty.all<RoundedRectangleBorder>(RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(4),
                              ))),
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
        : Container();
  }

  void _openApplication() {
    // TODO add query params with card info
    launchUrlString(buildConfig.applicationUrl, mode: LaunchMode.externalApplication);
  }
}
