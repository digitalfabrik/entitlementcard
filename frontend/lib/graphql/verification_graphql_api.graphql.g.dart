// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'verification_graphql_api.graphql.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CardVerificationByHash$Query _$CardVerificationByHash$QueryFromJson(
    Map<String, dynamic> json) {
  return CardVerificationByHash$Query()
    ..verifyCard = json['verifyCard'] as bool;
}

Map<String, dynamic> _$CardVerificationByHash$QueryToJson(
        CardVerificationByHash$Query instance) =>
    <String, dynamic>{
      'verifyCard': instance.verifyCard,
    };

CardVerificationModelInput _$CardVerificationModelInputFromJson(
    Map<String, dynamic> json) {
  return CardVerificationModelInput(
    hashModel: json['hashModel'] as String,
    totp: json['totp'] as int,
  );
}

Map<String, dynamic> _$CardVerificationModelInputToJson(
        CardVerificationModelInput instance) =>
    <String, dynamic>{
      'hashModel': instance.hashModel,
      'totp': instance.totp,
    };

CardVerificationByHashArguments _$CardVerificationByHashArgumentsFromJson(
    Map<String, dynamic> json) {
  return CardVerificationByHashArguments(
    card: json['card'] == null
        ? null
        : CardVerificationModelInput.fromJson(
            json['card'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$CardVerificationByHashArgumentsToJson(
        CardVerificationByHashArguments instance) =>
    <String, dynamic>{
      'card': instance.card?.toJson(),
    };
