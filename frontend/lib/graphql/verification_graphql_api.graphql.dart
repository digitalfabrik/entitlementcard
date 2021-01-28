// GENERATED CODE - DO NOT MODIFY BY HAND

import 'package:meta/meta.dart';
import 'package:artemis/artemis.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:equatable/equatable.dart';
import 'package:gql/ast.dart';
part 'verification_graphql_api.graphql.g.dart';

@JsonSerializable(explicitToJson: true)
class CardVerificationByHash$Query with EquatableMixin {
  CardVerificationByHash$Query();

  factory CardVerificationByHash$Query.fromJson(Map<String, dynamic> json) =>
      _$CardVerificationByHash$QueryFromJson(json);

  bool verifyCard;

  @override
  List<Object> get props => [verifyCard];
  Map<String, dynamic> toJson() => _$CardVerificationByHash$QueryToJson(this);
}

@JsonSerializable(explicitToJson: true)
class CardVerificationModelInput with EquatableMixin {
  CardVerificationModelInput({@required this.hashModel, @required this.totp});

  factory CardVerificationModelInput.fromJson(Map<String, dynamic> json) =>
      _$CardVerificationModelInputFromJson(json);

  String hashModel;

  int totp;

  @override
  List<Object> get props => [hashModel, totp];
  Map<String, dynamic> toJson() => _$CardVerificationModelInputToJson(this);
}

@JsonSerializable(explicitToJson: true)
class CardVerificationByHashArguments extends JsonSerializable
    with EquatableMixin {
  CardVerificationByHashArguments({@required this.card});

  @override
  factory CardVerificationByHashArguments.fromJson(Map<String, dynamic> json) =>
      _$CardVerificationByHashArgumentsFromJson(json);

  final CardVerificationModelInput card;

  @override
  List<Object> get props => [card];
  @override
  Map<String, dynamic> toJson() =>
      _$CardVerificationByHashArgumentsToJson(this);
}

class CardVerificationByHashQuery extends GraphQLQuery<
    CardVerificationByHash$Query, CardVerificationByHashArguments> {
  CardVerificationByHashQuery({this.variables});

  @override
  final DocumentNode document = DocumentNode(definitions: [
    OperationDefinitionNode(
        type: OperationType.query,
        name: NameNode(value: 'CardVerificationByHash'),
        variableDefinitions: [
          VariableDefinitionNode(
              variable: VariableNode(name: NameNode(value: 'card')),
              type: NamedTypeNode(
                  name: NameNode(value: 'CardVerificationModelInput'),
                  isNonNull: true),
              defaultValue: DefaultValueNode(value: null),
              directives: [])
        ],
        directives: [],
        selectionSet: SelectionSetNode(selections: [
          FieldNode(
              name: NameNode(value: 'verifyCard'),
              alias: null,
              arguments: [
                ArgumentNode(
                    name: NameNode(value: 'card'),
                    value: VariableNode(name: NameNode(value: 'card')))
              ],
              directives: [],
              selectionSet: null)
        ]))
  ]);

  @override
  final String operationName = 'CardVerificationByHash';

  @override
  final CardVerificationByHashArguments variables;

  @override
  List<Object> get props => [document, operationName, variables];
  @override
  CardVerificationByHash$Query parse(Map<String, dynamic> json) =>
      CardVerificationByHash$Query.fromJson(json);
}
