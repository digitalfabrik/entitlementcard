import 'package:flutter/material.dart';

class TopLoadingSpinner extends StatelessWidget {
  const TopLoadingSpinner({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(child: Column(children: const [LinearProgressIndicator()]));
  }
}
