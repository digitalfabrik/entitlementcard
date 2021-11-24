import 'package:flutter/material.dart';

class TopLoadingSpinner extends StatelessWidget {
  const TopLoadingSpinner({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SafeArea(child: Column(children: const [LinearProgressIndicator()]));
  }
}
