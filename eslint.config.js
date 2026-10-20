// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    ignores: ['projects/**/*', 'dist/**/*', 'coverage/**/*'],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@angular-eslint/prefer-standalone': 'off',
      // Reglas opinionadas añadidas al "recommended" desde angular-eslint v20.
      // Se mantienen deshabilitadas para conservar el mismo baseline de lint
      // que teniamos con v18 (el proyecto sigue NgModule + constructor injection).
      '@angular-eslint/prefer-inject': 'off',
      // Choca con la migracion oficial 'change-detection-eager' de Angular 22:
      // la migracion añade ChangeDetectionStrategy.Eager a los componentes para
      // preservar el comportamiento pre-v22 (OnPush es el default desde v22).
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
    ],
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'off',
    },
  },
);
