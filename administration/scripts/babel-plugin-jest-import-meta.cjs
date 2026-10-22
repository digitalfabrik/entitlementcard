// Replaces `import.meta` with an empty object, so ESM-only dependencies can be transformed to CommonJS for Jest.
// Our own sources are handled by `ts-jest-mock-import-meta` instead (see jest.config.ts).
module.exports = ({ types }) => ({
  name: 'jest-import-meta',
  visitor: {
    MetaProperty: path => {
      if (path.node.meta.name === 'import' && path.node.property.name === 'meta') {
        path.replaceWith(types.objectExpression([]))
      }
    },
  },
})
