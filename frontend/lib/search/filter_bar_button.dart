import 'package:ehrenamtskarte/category_assets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class FilterBarButton extends StatelessWidget {
  static const double width = 74;
  static const double height = 74;

  final CategoryAsset asset;
  final void Function(CategoryAsset, bool) onCategoryPress;
  final int index;
  final bool selected;

  const FilterBarButton({
    super.key,
    required this.asset,
    required this.onCategoryPress,
    required this.index,
    required this.selected,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final chipTheme = theme.chipTheme;
    final shape = chipTheme.shape ?? const RoundedRectangleBorder();

    return SizedBox(
      width: FilterBarButton.width,
      height: FilterBarButton.height,
      child: Material(
        color: selected ? chipTheme.selectedColor : chipTheme.backgroundColor,
        shape: shape.copyWith(side: selected ? BorderSide(color: theme.colorScheme.outline) : chipTheme.side),
        child: InkWell(
          customBorder: shape,
          onTap: () => onCategoryPress(asset, !selected),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                alignment: Alignment.center,
                child: SvgPicture.asset(asset.icon, width: 40.0, semanticsLabel: asset.name),
              ),
              const SizedBox(height: 2),
              Text(
                asset.shortName,
                style: theme.textTheme.labelSmall,
                maxLines: 2,
                textAlign: TextAlign.center,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
