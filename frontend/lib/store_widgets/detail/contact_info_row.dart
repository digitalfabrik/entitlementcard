import 'package:flutter/material.dart';

class ContactInfoRow extends StatelessWidget {
  final IconData _icon;
  final String _description;
  final String _label;
  final void Function() onTap;

  const ContactInfoRow(this._icon, this._description, this._label, {super.key, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    if (_description.isEmpty) {
      return const SizedBox.shrink();
    }
    return Semantics(
      link: true,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 10),
          child: Row(
            children: [
              Padding(
                padding: const EdgeInsets.only(right: 16),
                child: Icon(_icon, size: 28, color: theme.colorScheme.primary),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(_label, style: theme.textTheme.bodyMedium?.apply(color: theme.hintColor)),
                    const SizedBox(height: 4),
                    Text(
                      _description,
                      style: theme.textTheme.bodyLarge?.copyWith(
                        color: theme.colorScheme.primary,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
