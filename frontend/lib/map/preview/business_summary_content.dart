import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'business.dart';

class BusinessSummaryContent extends StatelessWidget {
  final AcceptingBusiness business;

  BusinessSummaryContent(this.business, {Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(business.name, style: TextStyle(fontWeight: FontWeight.bold)),
        Text(business.description)
      ],
    );
  }
}
