import 'package:flutter/material.dart';

class Section extends StatelessWidget {
  final String headline;
  final List<Widget> children;

  const Section({super.key, required this.headline, required this.children});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.only(top: 16, left: 16, right: 16),
          child: Text(headline,
              style: Theme.of(context)
                  .textTheme
                  .bodySmall
                  ?.merge(TextStyle(color: Theme.of(context).colorScheme.secondary))),
        ),
        Column(children: children),
        const SizedBox(height: 10),
      ],
    );
  }
}
