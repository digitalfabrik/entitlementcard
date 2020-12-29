import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'id_card.dart';

class NoCardView extends StatelessWidget {
  final VoidCallback onOpenQrScanner;

  const NoCardView({Key key, this.onOpenQrScanner}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        IdCard(
          child: Container(
              padding: EdgeInsets.all(16),
              alignment: Alignment.topLeft,
              child: Text(
                "Noch keine Ehrenamtskarte hinterlegt",
                textAlign: TextAlign.start,
                style: Theme.of(context)
                    .textTheme
                    .headline6
                    .merge(TextStyle(color: Colors.white70)),
              )),
        ),
        SizedBox(
          height: 24,
        ),
        RaisedButton(
            padding: EdgeInsets.symmetric(vertical: 12, horizontal: 24),
            onPressed: onOpenQrScanner,
            color: Theme.of(context).primaryColor,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(32.0),
            ),
            child: Text(
              "Code einscannen",
              style: Theme.of(context)
                  .textTheme
                  .headline6
                  .merge(TextStyle(color: Colors.white, fontSize: 20)),
            ))
      ],
    );
  }
}
