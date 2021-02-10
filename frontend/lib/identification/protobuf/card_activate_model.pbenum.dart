///
//  Generated code. Do not modify.
//  source: card_activate_model.proto
//
// @dart = 2.7
// ignore_for_file: annotate_overrides,camel_case_types,unnecessary_const,non_constant_identifier_names,library_prefixes,unused_import,unused_shown_name,return_of_invalid_type,unnecessary_this,prefer_final_fields

// ignore_for_file: UNDEFINED_SHOWN_NAME
import 'dart:core' as $core;
import 'package:protobuf/protobuf.dart' as $pb;

class CardActivateModel_CardType extends $pb.ProtobufEnum {
  static const CardActivateModel_CardType STANDARD = CardActivateModel_CardType._(0, const $core.bool.fromEnvironment('protobuf.omit_enum_names') ? '' : 'STANDARD');
  static const CardActivateModel_CardType GOLD = CardActivateModel_CardType._(1, const $core.bool.fromEnvironment('protobuf.omit_enum_names') ? '' : 'GOLD');

  static const $core.List<CardActivateModel_CardType> values = <CardActivateModel_CardType> [
    STANDARD,
    GOLD,
  ];

  static final $core.Map<$core.int, CardActivateModel_CardType> _byValue = $pb.ProtobufEnum.initByValue(values);
  static CardActivateModel_CardType valueOf($core.int value) => _byValue[value];

  const CardActivateModel_CardType._($core.int v, $core.String n) : super(v, n);
}

