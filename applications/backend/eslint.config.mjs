import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginSecurity from "eslint-plugin-security"

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    files: ['src/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'security': pluginSecurity,
    },
    rules: {
      ...pluginSecurity.configs.recommended.rules
    }
  }
);
