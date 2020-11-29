// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'graphql_api.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AcceptingStores _$AcceptingStoresFromJson(Map<String, dynamic> json) {
  return AcceptingStores()
    ..acceptingStores = (json['acceptingStores'] as List)
        ?.map((e) => e == null
            ? null
            : AcceptingStore.fromJson(e as Map<String, dynamic>))
        ?.toList();
}

Map<String, dynamic> _$AcceptingStoresToJson(AcceptingStores instance) =>
    <String, dynamic>{
      'acceptingStores':
          instance.acceptingStores?.map((e) => e?.toJson())?.toList(),
    };

AcceptingStore _$AcceptingStoreFromJson(Map<String, dynamic> json) {
  return AcceptingStore()
    ..id = json['id'] as int
    ..name = json['name'] as String;
}

Map<String, dynamic> _$AcceptingStoreToJson(AcceptingStore instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
    };
