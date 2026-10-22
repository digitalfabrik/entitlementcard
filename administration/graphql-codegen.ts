import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: '../specs/backend-api.graphql',
  documents: ['src/graphql/**/*.graphql'],
  generates: {
    // The config is now split into two files: one for the schema types and another for the operations
    // This is because @graphql-codegen/typed-document-node since version 7.x includes the functionality of
    // @graphql-codegen/typescript, but does not emit types that are not used in any operation.

    // All schema types, including those not selected by any operation (e.g. `GraphQlExceptionCode`)
    'src-gen/graphql-types.ts': {
      plugins: [
        // https://the-guild.dev/graphql/codegen/plugins/typescript/typescript
        'typescript',
      ],
      config: {
        avoidOptionals: true,
        constEnums: true,
        scalars: {
          DateTime: 'string',
        },
      },
    },
    'src-gen/graphql.ts': {
      plugins: [
        // https://the-guild.dev/graphql/codegen/plugins/other/add
        { add: { content: "export * from './graphql-types'" } },
        // https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-operations
        'typescript-operations',
        // https://the-guild.dev/graphql/codegen/plugins/typescript/typed-document-node
        'typed-document-node',
      ],
      config: {
        avoidOptionals: true,
        importSchemaTypesFrom: './src-gen/graphql-types.ts',
        scalars: {
          DateTime: 'string',
        },
      },
    },
  },
}

export default config
