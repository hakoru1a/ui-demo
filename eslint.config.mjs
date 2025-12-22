import { fixupConfigRules } from '@eslint/compat';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  ...fixupConfigRules(compat.extends('prettier')),

  {
    plugins: {
      prettier,
      '@typescript-eslint': typescriptEslint,
      react,
      'react-hooks': reactHooks,
      import: importPlugin,
      'jsx-a11y': jsxA11y
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',

      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        warnOnUnsupportedTypeScriptVersion: false,
        ecmaFeatures: {
          jsx: true
        }
      }
    },

    settings: {
      'import/resolver': {
        node: {
          moduleDirectory: ['node_modules', 'src/']
        },

        typescript: {
          alwaysTryTypes: true
        }
      }
    },

    rules: {
      // React rules
      'react/no-unescaped-entities': 'off',
      'react/jsx-filename-extension': 'off',
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
      'react/no-array-index-key': 'warn', // Changed from 'off' to 'warn'
      'react/react-in-jsx-scope': 'off',
      'react/jsx-props-no-spreading': 'off',

      // Import rules
      'import/order': [
        'warn',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ],
      'import/no-cycle': 'warn', // Changed from 'off' to 'warn' - circular imports are dangerous
      'import/no-extraneous-dependencies': 'off',

      // General rules
      'no-param-reassign': [
        'warn',
        {
          props: true,
          ignorePropertyModificationsFor: ['state', 'draft', 'acc'] // For Redux Toolkit and reducers
        }
      ],
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error']
        }
      ], // Changed from 'off' to 'warn', allow console.warn and console.error
      'no-shadow': 'off',

      // TypeScript rules
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-shadow': 'warn', // Changed from 'off' to 'warn'
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'none',
          ignoreRestSiblings: true
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn', // Add warning for any type
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Accessibility rules
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/no-autofocus': 'off',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Material-UI specific
      'no-restricted-imports': [
        'error',
        {
          patterns: ['@mui/*/*/*', '!@mui/material/test-utils/*']
        }
      ],

      // Prettier integration
      'prettier/prettier': [
        'warn',
        {
          bracketSpacing: true,
          printWidth: 140,
          singleQuote: true,
          trailingComma: 'none',
          tabWidth: 2,
          useTabs: false,
          semi: true,
          arrowParens: 'always',
          endOfLine: 'lf'
        }
      ]
    }
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.next/**',
      'out/**',
      'coverage/**',
      'bower_components/**',
      '.husky/**',
      'vite.config.mts',
      'eslint.config.mjs',
      '*.config.js',
      '*.config.ts',
      '*.config.mjs',
      '*.min.js',
      '*.bundle.js',
      '.env',
      '.env.*',
      '.vscode/**',
      '.idea/**',
      'public/mockServiceWorker.js'
    ]
  },
  {
    files: ['src/**/*.{js,jsx,ts,tsx}']
  }
];
