import 'package:flutter/material.dart';

class SmallButtonSpinner extends StatelessWidget {
  const SmallButtonSpinner({super.key});

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.all(4),
      child: SizedBox(height: 16, width: 16, child: CircularProgressIndicator(strokeWidth: 2)),
    );
  }
}
