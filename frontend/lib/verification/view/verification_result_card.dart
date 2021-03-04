import 'package:flutter/material.dart';

import 'content_card.dart';

class VerificationResultCard extends StatelessWidget {
  final Widget child;
  final String title;
  final bool isPositive;

  VerificationResultCard({
    Key key,
    this.child,
    this.title,
    @required this.isPositive
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var icon = isPositive ? Icons.verified_user : Icons.error;
    var color = isPositive ? Colors.green : Colors.red;
    return ContentCard(
        borderSide: isPositive
            ? const BorderSide(width: 1.0, color: Colors.black12)
            : const BorderSide(color: Colors.red, width: 4.0),
        child: Column(
        children: [
          RichText( // TODO feels strange to use RichText. Why not Row?
              text: TextSpan(
                  style: DefaultTextStyle.of(context)
                      .style
                      .apply(fontSizeFactor: 1.5),
                  children: [
                    WidgetSpan(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 2.0),
                        child: Icon(icon, color: color, size: 30),
                      ),
                    ),
                    if (title != null)
                      TextSpan(
                          text: title,
                          style: DefaultTextStyle.of(context)
                              .style
                              .apply(fontSizeFactor: 1.5, fontWeightDelta: 2)),
                  ])),
          if (child != null)
            child,
    ]));
  }
}
