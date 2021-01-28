///
//  Generated code. Do not modify.
//  source: card_verify_model.proto
//
// @dart = 2.7
// ignore_for_file: annotate_overrides,camel_case_types,unnecessary_const,non_constant_identifier_names,library_prefixes,unused_import,unused_shown_name,return_of_invalid_type,unnecessary_this,prefer_final_fields

import 'dart:core' as $core;

import 'package:fixnum/fixnum.dart' as $fixnum;
import 'package:protobuf/protobuf.dart' as $pb;

import 'card_verify_model.pbenum.dart';

export 'card_verify_model.pbenum.dart';

class CardVerifyModel extends $pb.GeneratedMessage {
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'CardVerifyModel', createEmptyInstance: create)
    ..aOS(1, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'fullName', protoName: 'fullName')
    ..a<$core.List<$core.int>>(2, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'randomBytes', $pb.PbFieldType.OY, protoName: 'randomBytes')
    ..a<$fixnum.Int64>(3, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'expirationDate', $pb.PbFieldType.OU6, protoName: 'expirationDate', defaultOrMaker: $fixnum.Int64.ZERO)
    ..e<CardVerifyModel_CardType>(5, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'cardType', $pb.PbFieldType.OE, protoName: 'cardType', defaultOrMaker: CardVerifyModel_CardType.STANDARD, valueOf: CardVerifyModel_CardType.valueOf, enumValues: CardVerifyModel_CardType.values)
    ..a<$core.int>(6, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'region', $pb.PbFieldType.O3)
    ..a<$core.int>(7, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'otp', $pb.PbFieldType.O3)
    ..hasRequiredFields = false
  ;

  CardVerifyModel._() : super();
  factory CardVerifyModel({
    $core.String fullName,
    $core.List<$core.int> randomBytes,
    $fixnum.Int64 expirationDate,
    CardVerifyModel_CardType cardType,
    $core.int region,
    $core.int otp,
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
    if (cardType != null) {
      _result.cardType = cardType;
    }
    if (region != null) {
      _result.region = region;
    }
    if (otp != null) {
      _result.otp = otp;
    }
    return _result;
  }
  factory CardVerifyModel.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory CardVerifyModel.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  CardVerifyModel clone() => CardVerifyModel()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  CardVerifyModel copyWith(void Function(CardVerifyModel) updates) => super.copyWith((message) => updates(message as CardVerifyModel)); // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static CardVerifyModel create() => CardVerifyModel._();
  CardVerifyModel createEmptyInstance() => create();
  static $pb.PbList<CardVerifyModel> createRepeated() => $pb.PbList<CardVerifyModel>();
  @$core.pragma('dart2js:noInline')
  static CardVerifyModel getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<CardVerifyModel>(create);
  static CardVerifyModel _defaultInstance;

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

  @$pb.TagNumber(5)
  CardVerifyModel_CardType get cardType => $_getN(3);
  @$pb.TagNumber(5)
  set cardType(CardVerifyModel_CardType v) { setField(5, v); }
  @$pb.TagNumber(5)
  $core.bool hasCardType() => $_has(3);
  @$pb.TagNumber(5)
  void clearCardType() => clearField(5);

  @$pb.TagNumber(6)
  $core.int get region => $_getIZ(4);
  @$pb.TagNumber(6)
  set region($core.int v) { $_setSignedInt32(4, v); }
  @$pb.TagNumber(6)
  $core.bool hasRegion() => $_has(4);
  @$pb.TagNumber(6)
  void clearRegion() => clearField(6);

  @$pb.TagNumber(7)
  $core.int get otp => $_getIZ(5);
  @$pb.TagNumber(7)
  set otp($core.int v) { $_setSignedInt32(5, v); }
  @$pb.TagNumber(7)
  $core.bool hasOtp() => $_has(5);
  @$pb.TagNumber(7)
  void clearOtp() => clearField(7);
}

