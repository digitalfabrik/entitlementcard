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
      children: _space(8, [
        Text(business.name,
            style: TextStyle(fontWeight: FontWeight.w500, fontSize: 16)),
        Text(business.description)
      ]),
    );
  }

  List<Widget> _space(double gap, Iterable<Widget> children) => children
      .expand((item) sync* {
        yield SizedBox(height: gap);
        yield item;
      })
      .skip(1)
      .toList();
}
