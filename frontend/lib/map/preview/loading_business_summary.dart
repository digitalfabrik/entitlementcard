import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

import 'business.dart';
import 'business_summary_content.dart';

class LoadingBusinessSummary extends StatefulWidget {
  final String businessId;

  LoadingBusinessSummary(this.businessId, {Key key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _LoadingBusinessSummaryState();
  }
}

class _LoadingBusinessSummaryState extends State<LoadingBusinessSummary> {
  AcceptingBusiness business;

  @override
  void initState() {
    super.initState();
    // TODO not just simulate loading info
    Future.delayed(
        Duration(seconds: 1),
        () => this.setState(() {
              business = AcceptingBusiness(
                  widget.businessId,
                  "Busy Business",
                  "Mock business data for ID ${widget.businessId}. "
                      "It could happen that this text is too wide for a single "
                      "line, so we should test it.");
            }));
  }

  @override
  Widget build(BuildContext context) {
    return business == null
        ? Container(
            padding: const EdgeInsets.symmetric(horizontal: 30),
            child: const LinearProgressIndicator())
        : BusinessSummaryContent(business);
  }
}
