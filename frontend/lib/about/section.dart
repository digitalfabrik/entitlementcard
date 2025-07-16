import 'package:flutter/material.dart';

class Section extends StatelessWidget {
  final String headline;
  final List<Widget> children;

  const Section({super.key, required this.headline, required this.children});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.only(top: 16, left: 16, right: 16),
          child: Text(headline, style: theme.textTheme.bodySmall?.apply(color: theme.colorScheme.secondary)),
        ),
        Column(children: children),
        const SizedBox(height: 10),
      ],
    );
  }
}
