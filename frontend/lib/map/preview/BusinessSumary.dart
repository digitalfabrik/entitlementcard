import 'package:flutter/material.dart';

class BusinessSummary extends StatelessWidget {
  const BusinessSummary({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.bottomCenter,
      child: SizedBox(
        width: double.infinity,
        child: Card(
            margin: const EdgeInsets.all(10),
            child: Container(
              padding: const EdgeInsets.all(10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Expanded(
                      child: Text(
                    "Lorem ipsum",
                  )),
                  Icon(Icons.arrow_forward,
                      color: Theme.of(context).primaryColor)
                ],
              ),
            )),
      ),
    );
  }
}
