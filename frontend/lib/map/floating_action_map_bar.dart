import 'package:ehrenamtskarte/location/determine_position.dart';
import 'package:ehrenamtskarte/map/location_button.dart';
import 'package:ehrenamtskarte/map/preview/accepting_store_preview.dart';
import 'package:flutter/material.dart';

const int fabPadding = 16;
const mapTabIndex = 0;

/// A bar which is shown above the map tab. It allows to navigate to the details
/// of an accepting store as well as to navigate to the current user position.
class FloatingActionMapBar extends StatelessWidget {
  final Future<void> Function(RequestedPosition) bringCameraToUser;
  final int? selectedAcceptingStoreId;
  final bool followUserLocation;
  final int currentTabIndex;

  const FloatingActionMapBar(
      {super.key,
      required this.bringCameraToUser,
      required this.selectedAcceptingStoreId,
      required this.currentTabIndex,
      required this.followUserLocation});

  @override
  Widget build(BuildContext context) {
    final finalSelectedAcceptingStoreId = selectedAcceptingStoreId;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.end,
      mainAxisAlignment: MainAxisAlignment.end,
      children: currentTabIndex == mapTabIndex
          ? [
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  LocationButton(bringCameraToUser: bringCameraToUser, followUserLocation: followUserLocation)
                ],
              ),
              AnimatedSize(
                duration: const Duration(milliseconds: 200),
                child: IntrinsicHeight(
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 200),
                    child: finalSelectedAcceptingStoreId != null
                        ? Container(
                            padding: EdgeInsets.only(top: fabPadding.toDouble()),
                            child: AcceptingStorePreview(finalSelectedAcceptingStoreId),
                          )
                        : null,
                  ),
                ),
              )
            ]
          : [],
    );
  }
}
