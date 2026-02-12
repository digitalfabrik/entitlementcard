import 'package:flutter/material.dart';

class ErrorMessage extends StatelessWidget {
  final String message;
  final bool canRefetch;

  const ErrorMessage({super.key, required this.message, this.canRefetch = true});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Icon(Icons.warning, color: Colors.orange),
        const SizedBox(width: 10),
        Expanded(child: Text(message, style: Theme.of(context).textTheme.bodyMedium)),
        canRefetch ? const Icon(Icons.replay) : Container(),
      ],
    );
  }
}
