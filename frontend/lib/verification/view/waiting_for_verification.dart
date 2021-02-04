import 'package:flutter/material.dart';

import 'content_card.dart';

class WaitingForVerification extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ContentCard(
        child: Column(children: [
          RichText(
              text: TextSpan(
                  style: DefaultTextStyle.of(context)
                      .style
                      .apply(fontSizeFactor: 1.5, fontWeightDelta: 2),
                  children: [
                TextSpan(
                    text:
                        "Bitte warten Sie, während der Code überprüft wird …"),
              ])),
          Center(
            child: CircularProgressIndicator(),
          ),
        ]),
        color: Colors.lime);
  }
}
