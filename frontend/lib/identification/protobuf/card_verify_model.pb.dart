///
//  Generated code. Do not modify.
//  source: card_verify_model.proto
//
// @dart = 2.12
// ignore_for_file: annotate_overrides,camel_case_types,unnecessary_const,non_constant_identifier_names,library_prefixes,unused_import,unused_shown_name,return_of_invalid_type,unnecessary_this,prefer_final_fields

import 'dart:core' as $core;

import 'package:fixnum/fixnum.dart' as $fixnum;
import 'package:protobuf/protobuf.dart' as $pb;

import 'card_verify_model.pbenum.dart';

export 'card_verify_model.pbenum.dart';

class CardVerifyModel extends $pb.GeneratedMessage {
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      const $core.bool.fromEnvironment('protobuf.omit_message_names')
          ? ''
          : 'CardVerifyModel',
      createEmptyInstance: create)
    ..aOS(
        1,
        const $core.bool.fromEnvironment('protobuf.omit_field_names')
            ? ''
            : 'fullName',
        protoName: 'fullName')
    ..aInt64(
        2,
        const $core.bool.fromEnvironment('protobuf.omit_field_names')
            ? ''
            : 'expirationDate',
        protoName: 'expirationDate')
    ..e<CardVerifyModel_CardType>(
        3,
        const $core.bool.fromEnvironment('protobuf.omit_field_names')
            ? ''
            : 'cardType',
        $pb.PbFieldType.OE,
        protoName: 'cardType',
        defaultOrMaker: CardVerifyModel_CardType.STANDARD,
        valueOf: CardVerifyModel_CardType.valueOf,
        enumValues: CardVerifyModel_CardType.values)
    ..a<$core.int>(
        4,
        const $core.bool.fromEnvironment('protobuf.omit_field_names')
            ? ''
            : 'regionId',
        $pb.PbFieldType.O3,
        protoName: 'regionId')
    ..a<$core.List<$core.int>>(
        6,
        const $core.bool.fromEnvironment('protobuf.omit_field_names')
            ? ''
            : 'hashSecret',
        $pb.PbFieldType.OY,
        protoName: 'hashSecret')
    ..a<$core.int>(
        7,
        const $core.bool.fromEnvironment('protobuf.omit_field_names')
            ? ''
            : 'otp',
        $pb.PbFieldType.O3)
    ..hasRequiredFields = false;

  CardVerifyModel._() : super();
  factory CardVerifyModel({
    $core.String? fullName,
    $fixnum.Int64? expirationDate,
    CardVerifyModel_CardType? cardType,
    $core.int? regionId,
    $core.List<$core.int>? hashSecret,
    $core.int? otp,
  }) {
    final _result = create();
    if (fullName != null) {
      _result.fullName = fullName;
    }
    if (expirationDate != null) {
      _result.expirationDate = expirationDate;
    }
    if (cardType != null) {
      _result.cardType = cardType;
    }
    if (regionId != null) {
      _result.regionId = regionId;
    }
    if (hashSecret != null) {
      _result.hashSecret = hashSecret;
    }
    if (otp != null) {
      _result.otp = otp;
    }
    return _result;
  }
  factory CardVerifyModel.fromBuffer($core.List<$core.int> i,
          [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(i, r);
  factory CardVerifyModel.fromJson($core.String i,
          [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(i, r);
  @$core.Deprecated('Using this can add significant overhead to your binary. '
      'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
      'Will be removed in next major version')
  CardVerifyModel clone() => CardVerifyModel()..mergeFromMessage(this);
  @$core.Deprecated('Using this can add significant overhead to your binary. '
      'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
      'Will be removed in next major version')
  CardVerifyModel copyWith(void Function(CardVerifyModel) updates) =>
      super.copyWith((message) => updates(message as CardVerifyModel))
          as CardVerifyModel; // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static CardVerifyModel create() => CardVerifyModel._();
  CardVerifyModel createEmptyInstance() => create();
  static $pb.PbList<CardVerifyModel> createRepeated() =>
      $pb.PbList<CardVerifyModel>();
  @$core.pragma('dart2js:noInline')
  static CardVerifyModel getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<CardVerifyModel>(create);
  static CardVerifyModel? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get fullName => $_getSZ(0);
  @$pb.TagNumber(1)
  set fullName($core.String v) {
    $_setString(0, v);
  }

  @$pb.TagNumber(1)
  $core.bool hasFullName() => $_has(0);
  @$pb.TagNumber(1)
  void clearFullName() => clearField(1);

  @$pb.TagNumber(2)
  $fixnum.Int64 get expirationDate => $_getI64(1);
  @$pb.TagNumber(2)
  set expirationDate($fixnum.Int64 v) {
    $_setInt64(1, v);
  }

  @$pb.TagNumber(2)
  $core.bool hasExpirationDate() => $_has(1);
  @$pb.TagNumber(2)
  void clearExpirationDate() => clearField(2);

  @$pb.TagNumber(3)
  CardVerifyModel_CardType get cardType => $_getN(2);
  @$pb.TagNumber(3)
  set cardType(CardVerifyModel_CardType v) {
    setField(3, v);
  }

  @$pb.TagNumber(3)
  $core.bool hasCardType() => $_has(2);
  @$pb.TagNumber(3)
  void clearCardType() => clearField(3);

  @$pb.TagNumber(4)
  $core.int get regionId => $_getIZ(3);
  @$pb.TagNumber(4)
  set regionId($core.int v) {
    $_setSignedInt32(3, v);
  }

  @$pb.TagNumber(4)
  $core.bool hasRegionId() => $_has(3);
  @$pb.TagNumber(4)
  void clearRegionId() => clearField(4);

  @$pb.TagNumber(6)
  $core.List<$core.int> get hashSecret => $_getN(4);
  @$pb.TagNumber(6)
  set hashSecret($core.List<$core.int> v) {
    $_setBytes(4, v);
  }

  @$pb.TagNumber(6)
  $core.bool hasHashSecret() => $_has(4);
  @$pb.TagNumber(6)
  void clearHashSecret() => clearField(6);

  @$pb.TagNumber(7)
  $core.int get otp => $_getIZ(5);
  @$pb.TagNumber(7)
  set otp($core.int v) {
    $_setSignedInt32(5, v);
  }

  @$pb.TagNumber(7)
  $core.bool hasOtp() => $_has(5);
  @$pb.TagNumber(7)
  void clearOtp() => clearField(7);
}
