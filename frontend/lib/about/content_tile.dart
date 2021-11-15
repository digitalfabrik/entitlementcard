import 'package:ehrenamtskarte/widgets/navigation_bar.dart';
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
          builder: (context) => ContentPage(title: title, children: children),
        ));
  }
}

class ContentPage extends StatelessWidget {
  final String title;
  final List<Widget> children;

  const ContentPage({Key? key, required this.title, required this.children})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: CustomScrollView(
      slivers: <Widget>[
        SliverAppBar(
          floating: false,
          backgroundColor: Colors.transparent,
          title: Text(title),
        ),
        SliverList(
          delegate: SliverChildListDelegate(children),
        ),
      ],
    ));
  }
}
