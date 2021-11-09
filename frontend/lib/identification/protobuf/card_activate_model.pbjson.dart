///
//  Generated code. Do not modify.
//  source: card_activate_model.proto
//
// @dart = 2.12
// ignore_for_file: annotate_overrides,camel_case_types,unnecessary_const,non_constant_identifier_names,library_prefixes,unused_import,unused_shown_name,return_of_invalid_type,unnecessary_this,prefer_final_fields,deprecated_member_use_from_same_package

import 'dart:core' as $core;
import 'dart:convert' as $convert;
import 'dart:typed_data' as $typed_data;
@$core.Deprecated('Use cardActivateModelDescriptor instead')
const CardActivateModel$json = const {
  '1': 'CardActivateModel',
  '2': const [
    const {'1': 'fullName', '3': 1, '4': 1, '5': 9, '10': 'fullName'},
    const {'1': 'expirationDate', '3': 2, '4': 1, '5': 3, '10': 'expirationDate'},
    const {'1': 'cardType', '3': 3, '4': 1, '5': 14, '6': '.CardActivateModel.CardType', '10': 'cardType'},
    const {'1': 'regionId', '3': 4, '4': 1, '5': 5, '10': 'regionId'},
    const {'1': 'hashSecret', '3': 6, '4': 1, '5': 12, '10': 'hashSecret'},
    const {'1': 'totpSecret', '3': 5, '4': 1, '5': 12, '10': 'totpSecret'},
  ],
  '4': const [CardActivateModel_CardType$json],
};

@$core.Deprecated('Use cardActivateModelDescriptor instead')
const CardActivateModel_CardType$json = const {
  '1': 'CardType',
  '2': const [
    const {'1': 'STANDARD', '2': 0},
    const {'1': 'GOLD', '2': 1},
  ],
};

/// Descriptor for `CardActivateModel`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List cardActivateModelDescriptor = $convert.base64Decode('ChFDYXJkQWN0aXZhdGVNb2RlbBIaCghmdWxsTmFtZRgBIAEoCVIIZnVsbE5hbWUSJgoOZXhwaXJhdGlvbkRhdGUYAiABKANSDmV4cGlyYXRpb25EYXRlEjcKCGNhcmRUeXBlGAMgASgOMhsuQ2FyZEFjdGl2YXRlTW9kZWwuQ2FyZFR5cGVSCGNhcmRUeXBlEhoKCHJlZ2lvbklkGAQgASgFUghyZWdpb25JZBIeCgpoYXNoU2VjcmV0GAYgASgMUgpoYXNoU2VjcmV0Eh4KCnRvdHBTZWNyZXQYBSABKAxSCnRvdHBTZWNyZXQiIgoIQ2FyZFR5cGUSDAoIU1RBTkRBUkQQABIICgRHT0xEEAE=');
