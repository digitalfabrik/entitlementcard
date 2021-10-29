import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class ContactInfoRow extends StatelessWidget {
  final IconData _icon;
  final String _description;
  final String _semanticLabel;
  final void Function()? onTap;
  final Color? iconColor;
  final Color? iconFillColor;

  const ContactInfoRow(this._icon, this._description, this._semanticLabel,
      {Key? key, this.onTap, this.iconColor, this.iconFillColor})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (_description == null || _description.isEmpty) {
      return const SizedBox(width: 0, height: 0);
    }
    var row = Row(children: [
      Padding(
          padding: const EdgeInsets.only(top: 6, bottom: 6, right: 16),
          child: ClipOval(
            child: Container(
              width: 42,
              height: 42,
              child: Icon(
                _icon,
                size: 28,
                semanticLabel: _semanticLabel,
                color: iconColor ?? Colors.white,
              ),
              color: iconFillColor ?? Theme.of(context).colorScheme.primary,
            ),
          )),
      Expanded(
        child: Text(
          _description,
        ),
      ),
    ]);
    var currentOnTap = onTap;
    return (currentOnTap == null)
        ? row
        : InkWell(
            child: row,
            onTap: currentOnTap,
          );
  }
}
