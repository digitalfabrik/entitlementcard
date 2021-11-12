import 'package:ehrenamtskarte/home/home_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';

class ContentTile extends StatelessWidget {
  final String title;
  final List<Widget> children;
  final IconData icon;

  const ContentTile(
      {Key? key,
      required this.title,
      required this.children,
      required this.icon})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
        leading: Icon(icon),
        title: Text(title),
        onTap: () => _showContent(context));
  }

  void _showContent(context) {
    Navigator.push(
        context,
        MaterialPageRoute(
          settings: AppBarParams.fromTitle(title).toRouteSettings(),
          builder: (context) => ContentPage( children: children),
        ));
  }
}

class ContentPage extends StatelessWidget {

  final List<Widget> children;

  const ContentPage({Key? key, required this.children})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: ListView(children: children, padding: const EdgeInsets.all(10)),
    );
  }
}
