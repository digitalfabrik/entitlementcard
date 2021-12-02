import 'package:ehrenamtskarte/util/sanitize_contact_details.dart';
import 'package:test/test.dart';

void main() {
  group("sanitize phone number", () {
    var sanitize = sanitizePhoneNumber;

    test("should not change valid number", () => expect(sanitize("+49-123-4567"), "+49-123-4567"));

    test("should replace inner spaces with -", () => expect(sanitize("   +49  123   4567 890 \n"), "+49-123-4567-890"));

    test("should remove letters", () => expect(sanitize("A12bCdE345G6h"), "123456"));

    test(
      "should remove special characters other than + and -",
      () => expect(sanitize("?1|';2#34*…_[]^!ſ\"\n5\$%6&"), "1234-56"),
    );
  });

  group("prepare website for display", () {
    const prepare = prepareWebsiteUrlForDisplay;
    const website = "www.musik-hofmann.de";

    test("should not change correctly formatted website", () => expect(prepare(website), website));

    test("should trim whitespace", () => expect(prepare("     \n$website "), website));

    test("should remove http prefix", () => expect(prepare(" http://$website"), website));

    test("should remove https prefix", () => expect(prepare("  https://$website"), website));
  });

  group("prepare website for launch", () {
    const prepare = prepareWebsiteUrlForLaunch;
    const website = "www.musik-hofmann.de";
    const websiteHttp = "http://$website";
    const websiteHttps = "https://$website";

    test("should not change correctly formatted website with https", () => expect(prepare(websiteHttps), websiteHttps));

    test("should not change correctly formatted website with http", () => expect(prepare(websiteHttp), websiteHttp));

    test("should trim whitespace", () => expect(prepare("     \n$websiteHttp "), websiteHttp));

    test("should add http prefix if missing", () => expect(prepare("  $website\t"), websiteHttp));
  });
}
