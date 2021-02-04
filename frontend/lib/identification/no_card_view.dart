import 'package:flutter/material.dart';

import 'id_card.dart';

class NoCardView extends StatelessWidget {
  final VoidCallback onOpenQrScanner;

  const NoCardView({Key key, this.onOpenQrScanner}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var isLandscape =
        MediaQuery.of(context).orientation == Orientation.landscape;
    return Flex(
      direction: isLandscape ? Axis.horizontal : Axis.vertical,
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      mainAxisSize: MainAxisSize.min,
      children: [
        IdCard(
          height: isLandscape ? 200 : null,
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
        SizedBox(height: 24),
        Flexible(
            fit: FlexFit.loose,
            child: Center(
                child: RaisedButton(
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
                    ))))
      ],
    );
  }
}
