import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: '../specs/backend-api.graphql',
  documents: ['src/graphql/**/*.graphql'],
  generates: {
    'src-gen/graphql.ts': {
      plugins: [
        // https://the-guild.dev/graphql/codegen/plugins/typescript/typescript
        'typescript',
        // https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-operations
        'typescript-operations',
        // https://the-guild.dev/graphql/codegen/plugins/typescript/typed-document-node
        'typed-document-node',
      ],
      config: {
        avoidOptionals: true,
        constEnums: true,
        // immutableTypes: true,
        scalars: {
          DateTime: 'string',
        },
      },
    },
  },
}

export default config
