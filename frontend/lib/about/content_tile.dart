import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';

class ContentTile extends StatelessWidget {
  final String title;
  final Widget content;
  final IconData icon;

  ContentTile({Key key, this.title, this.content, this.icon}) : super(key: key);

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
          builder: (context) => ContentPage(title: title, content: content),
        ));
  }
}

class ContentPage extends StatelessWidget {
  final String title;
  final Widget content;

  ContentPage({Key key, this.title, this.content}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: ListView(children: [
      Padding(
          padding: EdgeInsets.all(10),
          child: Text(title, style: Theme.of(context).textTheme.headline6)),
      Padding(
          padding: EdgeInsets.all(10),
          child: content),
    ]));
  }
}
