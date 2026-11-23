import 'package:ehrenamtskarte/util/color_utils.dart';
import 'package:flutter/material.dart';

class ContactInfoRow extends StatelessWidget {
  final IconData _icon;
  final String _description;
  final String _semanticLabel;
  final void Function()? onTap;

  const ContactInfoRow(this._icon, this._description, this._semanticLabel, {super.key, this.onTap});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final primaryColor = theme.colorScheme.primary;
    if (_description.isEmpty) {
      return const SizedBox.shrink();
    }
    final row = Row(
      children: [
        Padding(
          padding: const EdgeInsets.only(top: 6, bottom: 6, right: 16),
          child: ClipOval(
            child: Container(
              width: 42,
              height: 42,
              color: primaryColor,
              child: Icon(_icon, size: 28, semanticLabel: _semanticLabel, color: getReadableOnColor(primaryColor)),
            ),
          ),
        ),
        Expanded(child: Text(_description, style: theme.textTheme.bodyMedium)),
      ],
    );
    final currentOnTap = onTap;
    return (currentOnTap == null) ? row : InkWell(onTap: currentOnTap, child: row);
  }
}
