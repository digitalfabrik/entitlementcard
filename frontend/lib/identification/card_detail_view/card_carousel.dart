import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';

class CardCarousel extends StatefulWidget {
  final List<Widget> cards;
  final int cardIndex;
  final Function(int index) updateIndex;
  final CarouselSliderController carouselController;

  const CardCarousel(
      {super.key,
      required this.cards,
      required this.cardIndex,
      required this.updateIndex,
      required this.carouselController});

  @override
  CardCarouselState createState() => CardCarouselState();
}

class CardCarouselState extends State<CardCarousel> {
  @override
  Widget build(BuildContext context) {
    final int cardAmount = widget.cards.length;
    final double indicatorHeight = cardAmount > 1 ? 16 : 0;

    return LayoutBuilder(builder: (context, constraints) {
      return Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              child: CarouselSlider(
                items: widget.cards,
                carouselController: widget.carouselController,
                options: CarouselOptions(
                    enableInfiniteScroll: false,
                    viewportFraction: 0.96,
                    height: constraints.maxHeight - indicatorHeight,
                    onPageChanged: (index, reason) {
                      setState(() {
                        widget.updateIndex(index);
                      });
                    }),
              ),
            ),
          ),
          if (cardAmount > 1)
            Padding(
              padding: EdgeInsets.symmetric(vertical: 12),
              child: Container(
                height: indicatorHeight,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: widget.cards.asMap().entries.map((entry) {
                    return GestureDetector(
                      onTap: () => widget.carouselController.animateToPage(entry.key),
                      child: Container(
                        width: 8.0,
                        height: 8.0,
                        margin: EdgeInsets.symmetric(horizontal: 4.0),
                        decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: (Theme.of(context).brightness == Brightness.dark ? Colors.white : Colors.black)
                                .withOpacity(widget.cardIndex == entry.key ? 0.9 : 0.4)),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),
        ],
      );
    });
  }
}
