import 'package:flutter/material.dart';

import '../verification_error.dart';
import 'content_card.dart';

class NegativeVerificationResult extends StatelessWidget {
  final VerificationError verificationError;

  NegativeVerificationResult(this.verificationError);

  @override
  Widget build(BuildContext context) {
    return ContentCard(
      borderSide: BorderSide(color: Colors.red, width: 4.0),
      child: Column(children: [
        RichText(
            textAlign: TextAlign.center,
            text: TextSpan(
                style: DefaultTextStyle.of(context)
                    .style
                    .apply(fontSizeFactor: 1.3),
                children: [
                  WidgetSpan(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 2.0),
                      child: Icon(
                        Icons.error,
                        color: Colors.red,
                        size: 30,
                      ),
                    ),
                  ),
                  TextSpan(
                      text: "Die Ehrenamtskarte konnte nicht"
                          " validiert werden!\n\n",
                      style: DefaultTextStyle.of(context)
                          .style
                          .apply(fontSizeFactor: 1.5, fontWeightDelta: 2)),
                  verificationError.errorTextSpan,
                  TextSpan(
                      text: "\nFehlercode: ${verificationError.errorCode}"),
                ])),
      ]),
    );
  }
}
