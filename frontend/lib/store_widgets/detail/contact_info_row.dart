import 'package:flutter/material.dart';

class ContactInfoRow extends StatelessWidget {
  final IconData _icon;
  final String _description;
  final String _semanticLabel;
  final void Function()? onTap;
  final Color? iconColor;
  final Color? iconFillColor;

  const ContactInfoRow(
    this._icon,
    this._description,
    this._semanticLabel, {
    Key? key,
    this.onTap,
    this.iconColor,
    this.iconFillColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (_description.isEmpty) {
      return const SizedBox(width: 0, height: 0);
    }
    final row = Row(
      children: [
        Padding(
          padding: const EdgeInsets.only(top: 6, bottom: 6, right: 16),
          child: ClipOval(
            child: Container(
              width: 42,
              height: 42,
              color: iconFillColor ?? Theme.of(context).colorScheme.primary,
              child: Icon(
                _icon,
                size: 28,
                semanticLabel: _semanticLabel,
                color: iconColor ?? Colors.white,
              ),
            ),
          ),
        ),
        Expanded(
          child: Text(
            _description,
          ),
        ),
      ],
    );
    final currentOnTap = onTap;
    return (currentOnTap == null)
        ? row
        : InkWell(
            onTap: currentOnTap,
            child: row,
          );
  }
}
