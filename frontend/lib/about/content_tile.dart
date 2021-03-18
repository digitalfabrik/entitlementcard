import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';

class ContentTile extends StatelessWidget {
  final String title;
  final List<Widget> children;
  final IconData icon;

  ContentTile({Key key, this.title, this.children, this.icon})
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

  ContentPage({Key key, this.title, this.children}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
      ),
      body: ListView(children: children, padding: EdgeInsets.all(10)),
    );
  }
}
