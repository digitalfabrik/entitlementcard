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
          margin: EdgeInsets.all(10),
          child: Text("Lorem ipsum"),
        ),
      ),
    );
  }
}
