import 'package:ehrenamtskarte/home/app_flow.dart';
import 'package:flutter/material.dart';

const _indicatorWidth = 64.0;
const _indicatorHeight = 3.0;
const _animationDuration = Duration(milliseconds: 200);

class HomeNavigationBar extends StatelessWidget {
  final List<AppFlow> appFlows;
  final int currentIndex;
  final ValueChanged<int> onTap;

  const HomeNavigationBar({super.key, required this.appFlows, required this.currentIndex, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final primaryColor = colorScheme.primary;
    final inactiveColor = colorScheme.onSurface.withValues(alpha: 0.6);
    final itemCount = appFlows.length;
    final indicatorAlignment = itemCount > 1 ? -1.0 + 2.0 * currentIndex / (itemCount - 1) : 0.0;

    return Container(
      decoration: BoxDecoration(
        border: Border(top: BorderSide(color: colorScheme.onSurface.withValues(alpha: 0.2))),
      ),
      child: Stack(
        children: [
          NavigationBarTheme(
            data: NavigationBarThemeData(
              iconTheme: WidgetStateProperty.resolveWith(
                (states) => IconThemeData(color: states.contains(WidgetState.selected) ? primaryColor : inactiveColor),
              ),
            ),
            child: NavigationBar(
              selectedIndex: currentIndex,
              onDestinationSelected: onTap,
              height: 64,
              backgroundColor: colorScheme.surfaceContainerHighest,
              indicatorColor: Colors.transparent,
              labelTextStyle: WidgetStateTextStyle.resolveWith(
                (states) => states.contains(WidgetState.selected)
                    ? theme.textTheme.bodySmall!.copyWith(color: primaryColor, fontWeight: FontWeight.bold)
                    : theme.textTheme.bodySmall!.copyWith(color: inactiveColor, fontWeight: FontWeight.normal),
              ),
              destinations: appFlows
                  .map((appFlow) => NavigationDestination(icon: appFlow.icon, label: appFlow.getTitle(context)))
                  .toList(),
            ),
          ),
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: _indicatorHeight,
            child: ExcludeSemantics(
              child: AnimatedAlign(
                alignment: Alignment(indicatorAlignment, 0),
                duration: _animationDuration,
                curve: Curves.easeInOut,
                child: FractionallySizedBox(
                  widthFactor: 1 / itemCount,
                  child: Center(
                    child: Container(width: _indicatorWidth, height: _indicatorHeight, color: primaryColor),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
