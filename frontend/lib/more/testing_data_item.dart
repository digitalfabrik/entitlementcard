import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../identification/card_details.dart';
import '../identification/card_details_model.dart';

final validEakDetails = CardDetails(
    fullName: "Jane Doe",
    randomBytes: "sjdhb",
    expirationDate: 1610306137,
    cardType: "Ehrenamtskarte",
    totpSecret: "dfsbdfbskdfsjxdxgdxfgdydayfcgf",
    region: "Augsburg Land");

class TestingDataItem extends StatefulWidget {
  TestingDataItem({Key key}) : super(key: key);

  @override
  State<TestingDataItem> createState() => _TestingDataState();
}

class _TestingDataState extends State<TestingDataItem> {
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(15.0),
        child: InkWell(
          child: Column(
            children: [
              RaisedButton(
                onPressed: _resetEakData,
                child: Text('Reset EAK'),
              ),
              RaisedButton(
                onPressed: _setValidEakData,
                child: Text('Set valid EAK data'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _resetEakData() async {
    Provider.of<CardDetailsModel>(context, listen: false).clearCardDetails();
  }

  Future<void> _setValidEakData() async {
    Provider.of<CardDetailsModel>(context, listen: false)
        .setCardDetails(validEakDetails);
  }
}
