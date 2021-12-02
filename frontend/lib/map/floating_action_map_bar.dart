import 'package:ehrenamtskarte/location/determine_position.dart';
import 'package:ehrenamtskarte/map/location_button.dart';
import 'package:ehrenamtskarte/map/preview/accepting_store_preview.dart';
import 'package:flutter/material.dart';

const int fabPadding = 16;

/// A bar which is shown above the map tab. It allows to navigate to the details
/// of an accepting store as well as to navigate to the current user position.
class FloatingActionMapBar extends StatelessWidget {
  final Future<void> Function(RequestedPosition) bringCameraToUser;
  final int? selectedAcceptingStoreId;

  const FloatingActionMapBar({Key? key, required this.bringCameraToUser, required this.selectedAcceptingStoreId})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    var _selectedAcceptingStoreId = selectedAcceptingStoreId;
    return Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.end,
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [LocationButton(bringCameraToUser: bringCameraToUser)]),
          AnimatedSize(
            duration: const Duration(milliseconds: 200),
            child: IntrinsicHeight(
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 200),
                child: _selectedAcceptingStoreId != null
                    ? Container(
                        padding: EdgeInsets.only(top: fabPadding.toDouble()),
                        child: AcceptingStorePreview(_selectedAcceptingStoreId))
                    : null,
              ),
            ),
          )
        ]);
  }
}
