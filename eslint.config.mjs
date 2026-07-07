import js from '@eslint/js'
import eslintReact from '@eslint-react/eslint-plugin'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettier from 'eslint-plugin-prettier'
import tailwindcss from 'eslint-plugin-tailwindcss'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: ['node_modules/**', '.next/**'],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  eslintReact.configs['recommended-typescript'],

  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    plugins: {
      'jsx-a11y': jsxA11y,
      prettier,
      tailwindcss,
    },

    settings: {
      tailwindcss: {
        cssConfigPath: './src/app/globals.css',
      },
    },

    rules: {
      ...jsxA11y.configs.recommended.rules,

      'prettier/prettier': [
        'error',
        {
          trailingComma: 'all',
          semi: false,
          tabWidth: 2,
          singleQuote: true,
          printWidth: 130,
          endOfLine: 'auto',
          arrowParens: 'always',
        },
      ],
      'tailwindcss/classnames-order': 'error',
      'tailwindcss/enforces-shorthand': 'error',
      'tailwindcss/enforces-negative-arbitrary-values': 'error',
      'tailwindcss/no-contradicting-classname': 'error',
      'tailwindcss/no-unnecessary-arbitrary-value': 'error',
      'tailwindcss/no-arbitrary-value': 'off',
      'tailwindcss/migration-from-tailwind-2': 'off',
    },
  },
]
