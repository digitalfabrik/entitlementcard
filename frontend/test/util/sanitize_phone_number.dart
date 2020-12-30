import 'package:ehrenamtskarte/util/sanitize_phone_number.dart';
import 'package:test/test.dart';

void main() {
  group("sanitize phone number", () {
    var sanitize = sanitizePhoneNumber;

    test("should not change valid number",
        () => expect(sanitize("+49-123-4567"), "+49-123-4567"));

    test(
        "should replace inner spaces with -",
        () =>
            expect(sanitize("   +49  123   4567 890 \n"), "+49-123-4567-890"));

    test("should remove letters",
        () => expect(sanitize("A12bCdE345G6h"), "123456"));

    test("should remove special characters other than + and -",
        () => expect(sanitize("?1|';2#34*…_[]^!ſ\"\n5\$%6&"), "1234-56"));
  });
}
