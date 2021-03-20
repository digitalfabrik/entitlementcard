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
        SizedBox(
          height: 24,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: Theme.of(context).textTheme.headline6,
            ),
            TextButton(
                onPressed: onOrganisationDeleted,
                child: Text('LÖSCHEN'),
                style: TextButton.styleFrom(
                  primary: Theme.of(context).colorScheme.onPrimary,
                  backgroundColor: Theme.of(context).primaryColor,
                  padding: EdgeInsets.all(12),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.all(Radius.circular(4))),
                )),
          ],
        )
      ],
    );
  }
}
