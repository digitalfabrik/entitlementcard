import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

import '../../category_assets.dart';

class DetailLayout extends StatelessWidget {
  final String title;
  final Widget body;
  final int category;

  DetailLayout({this.title, this.body, this.category});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          leading: new IconButton(
            icon: new Icon(
              Icons.arrow_back_ios,
              color: Theme.of(context).textTheme.bodyText1.color,
            ),
            onPressed: () => Navigator.of(context).pop(),
          ),
          flexibleSpace: _headerImageForCategory(),
          bottom: PreferredSize(
              preferredSize: Size.fromHeight(75.0),
              child: Container(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  alignment: Alignment.bottomLeft,
                  child: Text(
                    title,
                    style: Theme.of(context).textTheme.headline6,
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ))),
          backgroundColor: Theme.of(context).primaryColorLight,
          elevation: 0.0, //No shadow
        ),
        body: SingleChildScrollView(
          child: body,
        ));
  }

  Widget _headerImageForCategory() {
    if (category == null || category >= categoryAssets.length) {
      return null;
    }
    return SvgPicture.asset(
      categoryAssets[category]['detailIcon'],
      semanticsLabel: 'Header',
      alignment: Alignment.bottomRight,
    );
  }
}
