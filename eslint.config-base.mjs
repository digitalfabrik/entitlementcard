import { fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import jest from 'eslint-plugin-jest'
import jsxA11Y from 'eslint-plugin-jsx-a11y'
import jsxExpressions from 'eslint-plugin-jsx-expressions'
import preferArrow from 'eslint-plugin-prefer-arrow'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import { createRequire } from 'module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parser, plugin } from 'typescript-eslint'

const require = createRequire(import.meta.url)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname
})

export default [
  ...compat.extends(
    'airbnb',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:jest/recommended',
    'plugin:jest/style'
  ),
  {
    plugins: {
      '@typescript-eslint': plugin,
      jest: jest,
      'jsx-a11y': jsxA11Y,
      'jsx-expressions': fixupPluginRules(jsxExpressions),
      'prefer-arrow': preferArrow,
      react: react,
      'react-hooks': reactHooks
    },

    linterOptions: {
      reportUnusedDisableDirectives: true
    },

    languageOptions: {
      parser: parser,
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        project: true
      }
    },

    settings: {
      jest: {
        // Since eslint is installed in a different directory than jest, the jest eslint plugin fails to automatically detect the version of jest//
        // https://github.com/digitalfabrik/entitlementcard/issues/1659
        version: require('jest/package.json').version
      }
    },

    rules: {
      // Overly strict rules (for now)
      '@typescript-eslint/no-non-null-assertion': 'off',
      'class-methods-use-this': 'off',
      'no-console': 'off',
      'no-magic-numbers': 'off',
      'no-param-reassign': 'off',
      'no-plusplus': 'off',
      'no-shadow': 'off',
      'no-underscore-dangle': 'off',
      'jest/no-mocks-import': 'off',
      'react/display-name': 'off',
      'react/jsx-props-no-spreading': 'off',

      // Unwanted
      'import/extensions': 'off',
      'import/named': 'off',
      'import/prefer-default-export': 'off',
      'import/no-named-as-default-member': 'off',
      'lines-between-class-members': 'off',
      'jest/expect-expect': 'off',
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          controlComponents: ['HTMLSelect']
        }
      ],
      'react/require-default-props': 'off',
      'react/sort-comp': 'off',

      // Disabled since better @typescript-eslint rules available, or they make no sense for ts projects
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '_(unused)?',
          varsIgnorePattern: '_(unused)?',
          ignoreRestSiblings: true
        }
      ],
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/prefer-ts-expect-error': 'error',
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowNullableBoolean: true,
          allowNullableString: true
        }
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      'consistent-return': 'off',
      curly: ['error', 'all'],
      'default-case': 'off',
      'func-names': 'error',
      'import/no-cycle': [
        'error',
        {
          maxDepth: '∞'
        }
      ],
      'import/no-unresolved': 'off',
      'jest/consistent-test-it': 'error',
      'jest/no-alias-methods': 'error',
      'jsx-expressions/strict-logical-expressions': 'error',
      'no-use-before-define': 'off',
      'prefer-arrow/prefer-arrow-functions': 'error',
      'prefer-destructuring': [
        'error',
        {
          array: false
        }
      ],
      'prefer-object-spread': 'error',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function'
        }
      ],
      'react/jsx-no-useless-fragment': [
        'error',
        {
          allowExpressions: true
        }
      ],
      'react/jsx-filename-extension': 'off',
      'react/no-did-mount-set-state': 'error',
      'react/no-unused-prop-types': 'warn',
      'react-hooks/exhaustive-deps': 'error'
    }
  },
  {
    files: [
      '**/*.test.{ts,tsx}',
      '**/__mocks__/*.{ts,tsx}',
      '**/testing/*.{ts,tsx}',
      '**/jest.setup.ts',
      '**/jest.config.ts'
    ],

    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'global-require': 'off',
      'import/no-extraneous-dependencies': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'no-console': 'off',
      'no-magic-numbers': 'off',
      'react/jsx-no-constructed-context-values': 'off'
    }
  }
]
