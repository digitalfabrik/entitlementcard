import 'package:flutter/material.dart';

import '../detail/detail_view.dart';
import 'loading_accepting_store_summary.dart';

class AcceptingStoreSummary extends StatelessWidget {
  final int acceptingStoreId;

  AcceptingStoreSummary(this.acceptingStoreId, {Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.bottomCenter,
      child: SizedBox(
          width: double.infinity,
          child: Card(
            margin: const EdgeInsets.all(10),
            child: InkWell(
                onTap: () {
                  _openDetailView(context, acceptingStoreId);
                },
                child: Container(
                  padding: const EdgeInsets.all(10),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Expanded(
                          child:
                              LoadingAcceptingStorySummary(acceptingStoreId)),
                      Icon(Icons.arrow_forward,
                          color: Theme.of(context).primaryColor),
                    ],
                  ),
                )),
          )),
    );
  }

  void _openDetailView(BuildContext context, int acceptingStoreId) {
    Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => DetailView(acceptingStoreId),
        ));
  }
}
