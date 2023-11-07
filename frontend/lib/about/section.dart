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
          padding: EdgeInsets.only(top: 20, left: 20, right: 20),
          child: Text(headline, style: TextStyle(color: Theme.of(context).colorScheme.primary)),
        ),
        Column(children: children),
        const SizedBox(height: 10),
      ],
    );
  }
}
