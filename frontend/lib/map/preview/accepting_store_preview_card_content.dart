import 'package:flutter/material.dart';

import '../../util/put_between.dart';
import 'models.dart';

class AcceptingStorePreviewCardContent extends StatelessWidget {
  final AcceptingStoreSummary acceptingStore;

  AcceptingStorePreviewCardContent(this.acceptingStore, {Key key})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Expanded(
              child: Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(acceptingStore.name ?? "Akzeptanzstelle",
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                            fontWeight: FontWeight.w500, fontSize: 16)),
                    if (acceptingStore.description != null)
                      Text(
                        acceptingStore.description,
                        maxLines: 4,
                        overflow: TextOverflow.ellipsis,
                      )
                  ]
                      .putBetween((_) => SizedBox(height: 8))
                      .toList(growable: false))),
          Icon(Icons.arrow_forward),
        ]);
  }
}
