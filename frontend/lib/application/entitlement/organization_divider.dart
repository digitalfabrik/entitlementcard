import 'package:flutter/material.dart';

class OrganizationDivider extends StatelessWidget {
  final String title;
  final VoidCallback onOrganisationDeleted;

  const OrganizationDivider({
    Key key,
    this.title,
    this.onOrganisationDeleted,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const SizedBox(height: 24),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: Theme.of(context).textTheme.headline6,
            ),
            ElevatedButton(
              onPressed: onOrganisationDeleted,
              child: const Text('LÖSCHEN'),
            ),
          ],
        )
      ],
    );
  }
}
