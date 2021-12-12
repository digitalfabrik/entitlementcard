///
//  Generated code. Do not modify.
//  source: card_verify_model.proto
//
// @dart = 2.12
// ignore_for_file: annotate_overrides,camel_case_types,unnecessary_const,non_constant_identifier_names,library_prefixes,unused_import,unused_shown_name,return_of_invalid_type,unnecessary_this,prefer_final_fields

// ignore_for_file: UNDEFINED_SHOWN_NAME
import 'dart:core' as $core;
import 'package:protobuf/protobuf.dart' as $pb;

class CardVerifyModel_CardType extends $pb.ProtobufEnum {
  static const CardVerifyModel_CardType STANDARD =
      CardVerifyModel_CardType._(0, const $core.bool.fromEnvironment('protobuf.omit_enum_names') ? '' : 'STANDARD');
  static const CardVerifyModel_CardType GOLD =
      CardVerifyModel_CardType._(1, const $core.bool.fromEnvironment('protobuf.omit_enum_names') ? '' : 'GOLD');

  static const $core.List<CardVerifyModel_CardType> values = <CardVerifyModel_CardType>[
    STANDARD,
    GOLD,
  ];

  static final $core.Map<$core.int, CardVerifyModel_CardType> _byValue = $pb.ProtobufEnum.initByValue(values);
  static CardVerifyModel_CardType? valueOf($core.int value) => _byValue[value];

  const CardVerifyModel_CardType._($core.int v, $core.String n) : super(v, n);
}
