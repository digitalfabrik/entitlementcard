import 'package:flutter/material.dart';

class StepTitleText extends StatelessWidget {
  final String title;

  const StepTitleText({Key key, this.title}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: Theme.of(context).textTheme.subtitle1,
    );
  }
}
