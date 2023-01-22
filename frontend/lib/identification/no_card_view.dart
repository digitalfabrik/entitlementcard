import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:flutter/material.dart';

class NoCardView extends StatelessWidget {
  final VoidCallback startVerification;
  final VoidCallback startActivation;
  final VoidCallback startApplication;

  const NoCardView({
    super.key,
    required this.startVerification,
    required this.startActivation,
    required this.startApplication,
  });

  @override
  Widget build(BuildContext context) {
    final localization = buildConfig.localization.ausweisen.noCardView;
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints viewportConstraints) => SingleChildScrollView(
        child: ConstrainedBox(
          constraints: BoxConstraints(minHeight: viewportConstraints.maxHeight),
          child: SafeArea(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _TapableCardWithArea(
                  onTap: startApplication,
                  title: localization.applyTitle,
                  description: localization.applyDescription,
                  icon: Icons.assignment,
                ),
                _TapableCardWithArea(
                  onTap: startActivation,
                  title: localization.activateTitle,
                  description: localization.activateDescription,
                  icon: Icons.add_card,
                ),
                _TapableCardWithArea(
                  onTap: startVerification,
                  title: localization.verifyTitle,
                  description: localization.verifyDescription,
                  icon: Icons.verified,
                ),
              ].wrapWithSpacers(height: 24),
            ),
          ),
        ),
      ),
    );
  }
}

class _TapableCardWithArea extends StatelessWidget {
  final VoidCallback onTap;
  final String title;
  final String description;
  final IconData icon;

  const _TapableCardWithArea({
    required this.onTap,
    required this.title,
    required this.description,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 24),
      clipBehavior: Clip.hardEdge,
      color: theme.colorScheme.surfaceVariant,
      elevation: 0,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 24, 24, 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 24,
                    backgroundColor: theme.colorScheme.background,
                    child: Icon(icon, size: 24, color: theme.colorScheme.primary),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      title,
                      style: Theme.of(context).textTheme.headline6,
                      textAlign: TextAlign.left,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text(
                description,
                style: Theme.of(context).textTheme.bodyMedium,
                textAlign: TextAlign.left,
              ),
              Align(
                alignment: Alignment.centerRight,
                child: Icon(Icons.arrow_forward, color: theme.colorScheme.primary, size: 25),
              )
            ],
          ),
        ),
      ),
    );
  }
}

extension _WrapWithSpacers on List<Widget> {
  List<Widget> wrapWithSpacers({double? height, double? width}) {
    final List<Widget> newList = [];
    final spacer = SizedBox(width: width, height: height);
    newList.add(spacer);
    for (final Widget widget in this) {
      newList.add(widget);
      newList.add(spacer);
    }
    return newList;
  }
}
