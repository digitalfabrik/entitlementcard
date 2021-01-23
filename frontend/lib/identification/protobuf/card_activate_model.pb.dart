///
//  Generated code. Do not modify.
//  source: card_activate_model.proto
//
// @dart = 2.7
// ignore_for_file: annotate_overrides,camel_case_types,unnecessary_const,non_constant_identifier_names,library_prefixes,unused_import,unused_shown_name,return_of_invalid_type,unnecessary_this,prefer_final_fields

import 'dart:core' as $core;

import 'package:fixnum/fixnum.dart' as $fixnum;
import 'package:protobuf/protobuf.dart' as $pb;

import 'card_activate_model.pbenum.dart';

export 'card_activate_model.pbenum.dart';

class CardActivateModel extends $pb.GeneratedMessage {
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'CardActivateModel', createEmptyInstance: create)
    ..aOS(1, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'fullName', protoName: 'fullName')
    ..a<$core.List<$core.int>>(2, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'randomBytes', $pb.PbFieldType.OY, protoName: 'randomBytes')
    ..a<$fixnum.Int64>(3, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'expirationDate', $pb.PbFieldType.OU6, protoName: 'expirationDate', defaultOrMaker: $fixnum.Int64.ZERO)
    ..a<$core.List<$core.int>>(4, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'totpSecret', $pb.PbFieldType.OY, protoName: 'totpSecret')
    ..e<CardActivateModel_CardType>(5, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'cardType', $pb.PbFieldType.OE, protoName: 'cardType', defaultOrMaker: CardActivateModel_CardType.STANDARD, valueOf: CardActivateModel_CardType.valueOf, enumValues: CardActivateModel_CardType.values)
    ..a<$core.int>(6, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'region', $pb.PbFieldType.O3)
    ..hasRequiredFields = false
  ;

  CardActivateModel._() : super();
  factory CardActivateModel({
    $core.String fullName,
    $core.List<$core.int> randomBytes,
    $fixnum.Int64 expirationDate,
    $core.List<$core.int> totpSecret,
    CardActivateModel_CardType cardType,
    $core.int region,
  }) {
    final _result = create();
    if (fullName != null) {
      _result.fullName = fullName;
    }
    if (randomBytes != null) {
      _result.randomBytes = randomBytes;
    }
    if (expirationDate != null) {
      _result.expirationDate = expirationDate;
    }
    if (totpSecret != null) {
      _result.totpSecret = totpSecret;
    }
    if (cardType != null) {
      _result.cardType = cardType;
    }
    if (region != null) {
      _result.region = region;
    }
    return _result;
  }
  factory CardActivateModel.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory CardActivateModel.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  CardActivateModel clone() => CardActivateModel()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  CardActivateModel copyWith(void Function(CardActivateModel) updates) => super.copyWith((message) => updates(message as CardActivateModel)); // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static CardActivateModel create() => CardActivateModel._();
  CardActivateModel createEmptyInstance() => create();
  static $pb.PbList<CardActivateModel> createRepeated() => $pb.PbList<CardActivateModel>();
  @$core.pragma('dart2js:noInline')
  static CardActivateModel getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<CardActivateModel>(create);
  static CardActivateModel _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get fullName => $_getSZ(0);
  @$pb.TagNumber(1)
  set fullName($core.String v) { $_setString(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasFullName() => $_has(0);
  @$pb.TagNumber(1)
  void clearFullName() => clearField(1);

  @$pb.TagNumber(2)
  $core.List<$core.int> get randomBytes => $_getN(1);
  @$pb.TagNumber(2)
  set randomBytes($core.List<$core.int> v) { $_setBytes(1, v); }
  @$pb.TagNumber(2)
  $core.bool hasRandomBytes() => $_has(1);
  @$pb.TagNumber(2)
  void clearRandomBytes() => clearField(2);

  @$pb.TagNumber(3)
  $fixnum.Int64 get expirationDate => $_getI64(2);
  @$pb.TagNumber(3)
  set expirationDate($fixnum.Int64 v) { $_setInt64(2, v); }
  @$pb.TagNumber(3)
  $core.bool hasExpirationDate() => $_has(2);
  @$pb.TagNumber(3)
  void clearExpirationDate() => clearField(3);

  @$pb.TagNumber(4)
  $core.List<$core.int> get totpSecret => $_getN(3);
  @$pb.TagNumber(4)
  set totpSecret($core.List<$core.int> v) { $_setBytes(3, v); }
  @$pb.TagNumber(4)
  $core.bool hasTotpSecret() => $_has(3);
  @$pb.TagNumber(4)
  void clearTotpSecret() => clearField(4);

  @$pb.TagNumber(5)
  CardActivateModel_CardType get cardType => $_getN(4);
  @$pb.TagNumber(5)
  set cardType(CardActivateModel_CardType v) { setField(5, v); }
  @$pb.TagNumber(5)
  $core.bool hasCardType() => $_has(4);
  @$pb.TagNumber(5)
  void clearCardType() => clearField(5);

  @$pb.TagNumber(6)
  $core.int get region => $_getIZ(5);
  @$pb.TagNumber(6)
  set region($core.int v) { $_setSignedInt32(5, v); }
  @$pb.TagNumber(6)
  $core.bool hasRegion() => $_has(5);
  @$pb.TagNumber(6)
  void clearRegion() => clearField(6);
}

