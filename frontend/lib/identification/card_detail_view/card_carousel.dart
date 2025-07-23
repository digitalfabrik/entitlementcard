import 'package:collection/collection.dart';
import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';

class CardCarousel extends StatefulWidget {
  final List<Widget> cards;
  final int cardIndex;
  final Function(int index) updateIndex;
  final CarouselSliderController carouselController;

  const CardCarousel({
    super.key,
    required this.cards,
    required this.cardIndex,
    required this.updateIndex,
    required this.carouselController,
  });

  @override
  CardCarouselState createState() => CardCarouselState();
}

const double indicatorHeight = 32;

class CardCarouselState extends State<CardCarousel> {
  @override
  Widget build(BuildContext context) {
    final int cardAmount = widget.cards.length;

    return Column(
      children: [
        Expanded(
          child: LayoutBuilder(
            builder: (context, constraints) => CarouselSlider(
              items: widget.cards,
              carouselController: widget.carouselController,
              options: CarouselOptions(
                enableInfiniteScroll: false,
                viewportFraction: 0.96,
                height: constraints.maxHeight,
                onPageChanged: (index, reason) => widget.updateIndex(index),
              ),
            ),
          ),
        ),
        if (cardAmount > 1)
          Container(
            height: indicatorHeight,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: widget.cards
                  .mapIndexed(
                    (index, value) => GestureDetector(
                      onTap: () => widget.carouselController.animateToPage(index),
                      child: Container(
                        width: 8.0,
                        height: 8.0,
                        margin: EdgeInsets.symmetric(horizontal: 4.0),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: (Theme.of(context).brightness == Brightness.dark ? Colors.white : Colors.black)
                              .withValues(alpha: widget.cardIndex == index ? 0.9 : 0.4),
                        ),
                      ),
                    ),
                  )
                  .toList(),
            ),
          ),
      ],
    );
  }
}
