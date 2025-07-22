import 'dart:math';

import 'package:flutter/widgets.dart';

class RectangularProgressIndicatorPainter extends CustomPainter {
  const RectangularProgressIndicatorPainter({required this.valueColor, required this.value});

  final Color valueColor;
  final double value;

  @override
  void paint(Canvas canvas, Size size) {
    const strokeWidth = 6.0;
    const radius = 12.0;
    const splashDuration = 0.01;
    const delay = 0.01;
    const fadeOutDuration = 0.03;
    const strokeRadius = radius - strokeWidth / 2;
    const quarterArcLength = pi * strokeRadius / 2;
    final verticalLineLength = size.height - strokeWidth - 2 * strokeRadius;
    final horizontalLineLength = size.width - strokeWidth - 2 * strokeRadius;
    final paint = Paint();
    paint.style = PaintingStyle.stroke;
    paint.strokeWidth = strokeWidth;
    paint.color = valueColor;
    paint.strokeCap = StrokeCap.round;

    final totalPathLength = 2 * horizontalLineLength + 2 * verticalLineLength + 4 * quarterArcLength;
    Path createPath(double initialPath) {
      final path = Path();
      var remainingPath = initialPath;
      path.moveTo(size.width / 2, strokeWidth / 2);
      {
        // First half top line
        path.relativeLineTo(-min(remainingPath, horizontalLineLength / 2), 0);
        remainingPath = max(remainingPath - horizontalLineLength / 2, 0);
      }
      {
        // Top left arc
        final angle = min(remainingPath / quarterArcLength, 1.0) * pi / 2;
        final dest = Offset(-strokeRadius * sin(angle), strokeRadius * (1 - cos(angle)));
        path.relativeArcToPoint(dest, radius: const Radius.circular(strokeRadius), clockwise: false);
        remainingPath = max(remainingPath - quarterArcLength, 0);
      }
      {
        // Vertical line left
        path.relativeLineTo(0, min(remainingPath, verticalLineLength));
        remainingPath = max(remainingPath - verticalLineLength, 0);
      }
      {
        // Bottom left arc
        final angle = min(remainingPath / quarterArcLength, 1.0) * pi / 2;
        final dest = Offset(strokeRadius * (1 - cos(angle)), strokeRadius * sin(angle));
        path.relativeArcToPoint(dest, radius: const Radius.circular(strokeRadius), clockwise: false);
        remainingPath = max(remainingPath - quarterArcLength, 0);
      }
      {
        // Horizontal line bottom
        path.relativeLineTo(min(remainingPath, horizontalLineLength), 0);
        remainingPath = max(remainingPath - horizontalLineLength, 0);
      }
      {
        // Bottom right arc
        final angle = min(remainingPath / quarterArcLength, 1.0) * pi / 2;
        final dest = Offset(strokeRadius * sin(angle), -strokeRadius * (1 - cos(angle)));
        path.relativeArcToPoint(dest, radius: const Radius.circular(strokeRadius), clockwise: false);
        remainingPath = max(remainingPath - quarterArcLength, 0);
      }
      {
        // Vertical line right
        path.relativeLineTo(0, -min(remainingPath, verticalLineLength));
        remainingPath = max(remainingPath - verticalLineLength, 0);
      }
      {
        // Top right arc
        final angle = min(remainingPath / quarterArcLength, 1.0) * pi / 2;
        final dest = Offset(-strokeRadius * (1 - cos(angle)), -strokeRadius * sin(angle));
        path.relativeArcToPoint(dest, radius: const Radius.circular(strokeRadius), clockwise: false);
        remainingPath = max(remainingPath - quarterArcLength, 0);
      }
      {
        // Second half top line
        path.relativeLineTo(-min(remainingPath, horizontalLineLength / 2), 0);
      }
      return path;
    }

    final remainingPath = max(totalPathLength * (value - delay / 2 - splashDuration) / (1 - delay), 0.0);

    canvas.drawPath(createPath(remainingPath), paint);
    canvas.drawPath(createPath(totalPathLength), paint..color = paint.color.withAlpha(30));
    // Draw splash effect
    final circlePaint = Paint();
    circlePaint.color = valueColor;
    circlePaint.style = PaintingStyle.fill;
    final maxRadius = sqrt((size.width / 2) * (size.width / 2) + size.height * size.height);
    if (value >= delay / 2 && value <= splashDuration + delay / 2) {
      canvas.drawCircle(
        Offset(size.width / 2, 0),
        maxRadius * (1 - Curves.easeInOut.transform((value - delay / 2) / splashDuration)),
        circlePaint,
      );
    } else if (value <= delay / 2 || value >= 1 - delay / 2) {
      canvas.drawCircle(Offset(size.width / 2, 0), maxRadius, circlePaint);
    } else if (value <= 1 - delay / 2 && value >= 1 - fadeOutDuration - delay / 2) {
      circlePaint.color = valueColor.withValues(
        alpha: 1 - Curves.easeInOut.transform((1 - (value + delay / 2)) / fadeOutDuration),
      );
      canvas.drawCircle(Offset(size.width / 2, 0), maxRadius, circlePaint);
    }
  }

  @override
  bool shouldRepaint(RectangularProgressIndicatorPainter oldDelegate) {
    return oldDelegate.valueColor != valueColor || oldDelegate.value != value;
  }
}
