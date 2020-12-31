import 'package:flutter/material.dart';
import 'menu_item.dart';

class MorePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 24, horizontal: 18),
      child: Expanded(
        child: GridView.count(crossAxisCount: 2, shrinkWrap: true, children: [
          Center(
              child: MenuItem(
            title: 'About',
            icon: Icons.info_outline,
            callback: () => _showAboutDialog(context),
          ))
        ]),
      ),
    );
  }

  void _showAboutDialog(context) => showAboutDialog(
        context: context,
        applicationIcon: FlutterLogo(),
        applicationName: 'Ehrenamtskarte',
        applicationVersion: '1.0.0',
        applicationLegalese: 'Copyright Ehrenamtskarten Kompetenzteam',
      );
}
