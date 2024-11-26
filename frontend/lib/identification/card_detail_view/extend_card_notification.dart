import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:tinycolor2/tinycolor2.dart';
import 'package:url_launcher/url_launcher_string.dart';

class ExtendCardNotification extends StatefulWidget {
  final String applicationUrl;

  const ExtendCardNotification({super.key, required this.applicationUrl});
  @override
  State<ExtendCardNotification> createState() => _ExtendCardNotificationState();
}

class _ExtendCardNotificationState extends State<ExtendCardNotification> {
  bool _isVisible = true;

  @override
  Widget build(BuildContext context) {
    if (!_isVisible) return Container();

    final primaryColor = Theme.of(context).colorScheme.primary;
    final backgroundColor =
        Theme.of(context).brightness == Brightness.light ? primaryColor.tint(90) : primaryColor.shade(90);

    return Padding(
      padding: const EdgeInsets.all(8),
      child: Card(
        color: backgroundColor,
        elevation: 1,
        margin: EdgeInsets.zero,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: _buildContent(context),
        ),
      ),
    );
  }

  Widget _buildContent(BuildContext context) {
    final t = context.t;

    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Row(
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
                style: FilledButton.styleFrom(
                  backgroundColor: colorScheme.primary,
                  elevation: 2,
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
    );
  }

  void _openApplication() {
    launchUrlString(widget.applicationUrl, mode: LaunchMode.externalApplication);
  }
}
