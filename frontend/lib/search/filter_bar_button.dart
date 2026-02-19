import 'package:ehrenamtskarte/category_assets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class FilterBarButton extends StatefulWidget {
  static const double width = 74;
  static const double height = 74;

  final CategoryAsset asset;
  final void Function(CategoryAsset, bool) onCategoryPress;
  final int index;

  const FilterBarButton({super.key, required this.asset, required this.onCategoryPress, required this.index});

  @override
  State<StatefulWidget> createState() {
    return _FilterBarButtonState();
  }
}

class _FilterBarButtonState extends State<FilterBarButton> {
  bool _selected = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final chipTheme = theme.chipTheme;
    final shape = chipTheme.shape ?? const RoundedRectangleBorder();

    return SizedBox(
      width: FilterBarButton.width,
      height: FilterBarButton.height,
      child: Material(
        color: _selected ? chipTheme.selectedColor : chipTheme.backgroundColor,
        shape: shape.copyWith(side: _selected ? BorderSide(color: theme.colorScheme.outline) : chipTheme.side),
        child: InkWell(
          customBorder: shape,
          onTap: () {
            setState(() {
              _selected = !_selected;
              widget.onCategoryPress(widget.asset, _selected);
            });
          },
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                alignment: Alignment.center,
                child: SvgPicture.asset(widget.asset.icon, width: 40.0, semanticsLabel: widget.asset.name),
              ),
              const SizedBox(height: 2),
              Text(
                widget.asset.shortName,
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
