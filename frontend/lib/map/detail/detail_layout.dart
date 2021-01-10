import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

import '../../category_assets.dart';

class DetailLayout extends StatelessWidget {
  final String title;
  final Widget body;
  final int categoryId;
  final String categoryName;

  DetailLayout({this.title, this.body, this.categoryId, this.categoryName});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: Icon(
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
                  child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          categoryName ?? "",
                          style: Theme.of(context).textTheme.bodyText2,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Text(
                          title ?? "",
                          style: Theme.of(context).textTheme.headline6,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        )
                      ]))),
          backgroundColor: Theme.of(context).primaryColorLight,
          elevation: 0.0, //No shadow
        ),
        body: SingleChildScrollView(
          child: body,
        ));
  }

  Widget _headerImageForCategory() {
    if (categoryId == null || categoryId > categoryAssets.length) {
      return null;
    }
    return SvgPicture.asset(
      categoryAssets[categoryId].detailIcon,
      semanticsLabel: 'Header',
      alignment: Alignment.bottomRight,
    );
  }
}
