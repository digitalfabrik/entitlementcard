import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import '../../graphql/graphql_api.dart';
import '../../graphql/graphql_api.graphql.dart';
import '../../util/color_utils.dart';
import '../../category_assets.dart';

const double bottomSize = 100;

class DetailAppBarBackButton extends StatelessWidget {
  final Color textColor;

  const DetailAppBarBackButton({Key? key, required this.textColor})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: Icon(
        Icons.arrow_back_ios,
        color: textColor,
      ),
      onPressed: () => Navigator.of(context).maybePop(),
    );
  }
}

class DetailAppBarHeaderImage extends StatelessWidget {
  final int? categoryId;

  const DetailAppBarHeaderImage({Key? key, this.categoryId}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var currentCategoryId = categoryId;

    if (currentCategoryId != null &&
        currentCategoryId <= categoryAssets.length) {
      var currentDetailIcon = categoryAssets[currentCategoryId].detailIcon;
      if (currentDetailIcon != null) {
        return SvgPicture.asset(
          currentDetailIcon,
          semanticsLabel: 'Header',
          alignment: Alignment.bottomRight,
        );
      }
    }
    return Container();
  }
}

class DetailAppBarBottom extends StatelessWidget {
  final Color textColorGrey;
  final Color textColor;
  final String? title;
  final int? categoryId;
  final String? categoryName;
  final Color? accentColor;

  const DetailAppBarBottom(
      {Key? key,
      this.title,
      this.categoryId,
      this.categoryName,
      this.accentColor,
      required this.textColorGrey,
      required this.textColor})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        alignment: Alignment.bottomLeft,
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(
            categoryName ?? "",
            style: Theme.of(context)
                .textTheme
                .bodyText2
                ?.apply(color: textColorGrey),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          Text(
            title ?? "",
            style:
                Theme.of(context).textTheme.headline6?.apply(color: textColor),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          )
        ]));
  }
}

class DetailAppBar extends StatelessWidget {
  final AcceptingStoreById$Query$PhysicalStore matchingStore;

  const DetailAppBar(this.matchingStore, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var categoryId = matchingStore.store.category.id;

    final accentColor = getDarkenedColorForCategory(categoryId);
    final categoryName = matchingStore.store.category.name;
    final title = matchingStore.store.name ?? "Akzeptanzstelle";

    final backgroundColor =
        accentColor ?? Theme.of(context).colorScheme.primary;
    final textColor = getReadableOnColor(backgroundColor);
    final textColorGrey = getReadableOnColorSecondary(backgroundColor);

    return SizedBox(
        height: bottomSize + kToolbarHeight,
        child: AppBar(
          leading: const BackButton(),
          flexibleSpace: DetailAppBarHeaderImage(categoryId: categoryId),
          bottom: PreferredSize(
              preferredSize: const Size.fromHeight(bottomSize),
              child: SizedBox(
                  height: bottomSize,
                  child: DetailAppBarBottom(
                      title: title,
                      categoryId: categoryId,
                      categoryName: categoryName,
                      accentColor: accentColor,
                      textColorGrey: textColorGrey,
                      textColor: textColor))),
          backgroundColor: accentColor,
          elevation: 0.0, //No shadow
        ));
  }
}
