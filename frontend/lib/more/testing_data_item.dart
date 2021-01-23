import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../identification/card_details.dart';
import '../identification/personal_card_details.dart';
import '../identification/personal_card_details_model.dart';

final validEakDetails = PersonalCardDetails("base32TotpSecret",
    CardDetails("Jane Doe", null, 1677542400, "STANDARD", 42));

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
    Provider.of<PersonalCardDetailsModel>(context, listen: false)
        .clearPersonalCardDetails();
  }

  Future<void> _setValidEakData() async {
    Provider.of<PersonalCardDetailsModel>(context, listen: false)
        .setPersonalCardDetails(validEakDetails);
  }
}
