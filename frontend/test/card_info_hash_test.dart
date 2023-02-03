import 'package:ehrenamtskarte/identification/qr_code_utils.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:test/test.dart';

void main() {
  group("card info hash", () {
    test(
      "should not change valid number",
      () {
        final cardInfo = CardInfo(
              expirationDay: null,
              extensions: CardExtensions(
                extensionRegion: RegionExtension(regionId: 0),
                extensionBavariaCardType: BavariaCardTypeExtension(cardType: BavariaCardType.STANDARD),
              ),
            );
        expect(
        const QrCodeUtils().pbMessageToJson(
          CardInfo.fromBuffer(
            cardInfo.writeToBuffer(),
          ),
        ),
        {
          "3": {
            // Extensions
            "1": {"1": "123"},
            "4": {"1": "1"}
          }
        },
      );
      },
    );
  });
}
