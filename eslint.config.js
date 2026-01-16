import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import security from 'eslint-plugin-security';
import globals from 'globals';

export default [
  // Ignore patterns - must be first
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      '*.min.js',
      'tests/**',
      'public/sw.js',
    ],
  },

  // Base ESLint recommended config
  eslint.configs.recommended,
  
  // TypeScript configs
  ...tseslint.configs.recommended,
  
  // Astro configs
  ...eslintPluginAstro.configs.recommended,
  
  // Security plugin config
  security.configs.recommended,
  
  // Global settings
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  
  // Custom rules for all files
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    rules: {
      // Security rules
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-child-process': 'warn',
      'security/detect-disable-mustache-escape': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-non-literal-require': 'warn',
      'security/detect-possible-timing-attacks': 'warn',
      'security/detect-pseudoRandomBytes': 'error',
      
      // Code quality rules
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      
      // General rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'warn',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
    },
  },
  
  // Astro file specific config
  {
    files: ['**/*.astro'],
    rules: {
      // Astro-specific rule adjustments
      'no-console': 'off',
      'no-alert': 'off',
    },
  },

  // TypeScript declaration files
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },

  // Utility files that may use console
  {
    files: ['**/utils/**/*.{js,ts}'],
    rules: {
      'no-console': 'off',
    },
  },
];
