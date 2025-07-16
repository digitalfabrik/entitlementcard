import 'package:flutter/material.dart';

class IntroSlide extends StatelessWidget {
  final String title;
  final String description;
  final String pathImage;

  const IntroSlide({super.key, required this.title, required this.description, required this.pathImage});

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return MediaQuery.removePadding(
      context: context,
      removeBottom: true,
      removeTop: true,
      removeLeft: true,
      removeRight: true,
      child: ListView(
        // Only allow scrolling (vertically) if there is sufficient content.
        // This improves the experience to scroll (horizontally) with the Slider controller.
        primary: false,
        padding: MediaQuery.maybePaddingOf(context),
        children: [
          Container(
            // Title
            margin: const EdgeInsets.only(top: 70.0, bottom: 50.0, left: 20.0, right: 20.0),
            child: Text(
              title,
              style: textTheme.headlineSmall,
              maxLines: 3,
              textAlign: TextAlign.center,
              overflow: TextOverflow.ellipsis,
            ),
          ),

          Image.asset(pathImage, width: 200.0, height: 200.0, fit: BoxFit.contain),

          // Description
          Container(
            margin: const EdgeInsets.fromLTRB(20.0, 50.0, 20.0, 50.0),
            child: Text(
              description,
              style: textTheme.bodyLarge?.apply(fontSizeFactor: 1.2),
              textAlign: TextAlign.center,
              maxLines: 100,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
