import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import reactHooks from 'eslint-plugin-react-hooks'
import { reactRefresh } from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite(),
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
  },

  // Architecture boundaries (see README):
  // outside a feature, import it only through its public index.ts…
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/features/**', 'src/**/*.test.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: 'features/[^/]+/.+',
              message: "Import features through their public API, e.g. '../features/stamp'.",
            },
          ],
        },
      ],
    },
  },
  // …and shared code never depends on features.
  {
    files: ['src/components/**', 'src/utils/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '(^|/)features(/|$)',
              message: 'Shared code (components/, utils/) must not depend on features.',
            },
          ],
        },
      ],
    },
  },
])
