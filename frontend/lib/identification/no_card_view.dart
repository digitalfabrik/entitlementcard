import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'id_card.dart';

class NoCardView extends StatelessWidget {
  final VoidCallback onOpenQrScanner;

  const NoCardView({Key key, this.onOpenQrScanner}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        IdCard(
            child: InkWell(
                onTap: onOpenQrScanner,
                child: Padding(
                    padding: EdgeInsets.all(24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                            alignment: Alignment.topLeft,
                            child: Text(
                              "Noch keine Ehrenamtskarte hinterlegt",
                              textAlign: TextAlign.start,
                              style: Theme.of(context)
                                  .textTheme
                                  .headline6
                                  .merge(TextStyle(color: Colors.white54)),
                            )),
                        RaisedButton(
                            padding: EdgeInsets.symmetric(
                                vertical: 12, horizontal: 24),
                            onPressed: () {},
                            color: Theme.of(context).primaryColor,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(32.0),
                            ),
                            child: Text(
                              "Code einscannen",
                              style: Theme.of(context)
                                  .textTheme
                                  .headline6
                                  .merge(TextStyle(
                                      color: Colors.white, fontSize: 20)),
                            ))
                      ],
                    )))),
      ],
    );
  }
}
