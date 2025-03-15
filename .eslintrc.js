module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:nuxt/recommended',
    'plugin:prettier/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2022,
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    // Vue specific rules
    'vue/multi-word-component-names': 'off', // Allow single word component names
    'vue/require-default-prop': 'off', // Not needed with TypeScript props
    'vue/no-v-html': 'warn', // Allow v-html but warn about potential XSS
    'vue/component-tags-order': ['error', {
      order: ['script', 'template', 'style']
    }],
    'vue/attributes-order': ['error', {
      order: [
        'DEFINITION',
        'LIST_RENDERING',
        'CONDITIONALS',
        'RENDER_MODIFIERS',
        'GLOBAL',
        ['UNIQUE', 'SLOT'],
        'TWO_WAY_BINDING',
        'OTHER_DIRECTIVES',
        'OTHER_ATTR',
        'EVENTS',
        'CONTENT'
      ]
    }],

    // TypeScript rules
    '@typescript-eslint/no-explicit-any': 'warn', // Warn about any type
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Not needed with TypeScript inference
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    '@typescript-eslint/no-non-null-assertion': 'warn', // Warn about non-null assertions

    // General code quality rules
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': ['error', 'always', { 'null': 'ignore' }],
    'curly': ['error', 'all'],
    'max-len': ['warn', {
      code: 100,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
      ignoreComments: true
    }],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
      { blankLine: 'always', prev: 'directive', next: '*' },
      { blankLine: 'always', prev: '*', next: 'function' }
    ],

    // Prettier integration
    'prettier/prettier': ['error', {
      singleQuote: true,
      semi: true,
      tabWidth: 2,
      trailingComma: 'es5',
      printWidth: 100,
      endOfLine: 'auto'
    }]
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'indent': 'off' // Let prettier handle Vue file indentation
      }
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // TypeScript-specific overrides
        'no-undef': 'off' // TypeScript already checks this
      }
    },
    {
      files: ['src/server/**/*.ts'],
      rules: {
        // Server-side specific rules
        'no-console': 'off' // Allow console in server code
      }
    }
  ],
  ignorePatterns: [
    'node_modules',
    '.nuxt',
    '.output',
    'dist',
    'public',
    '*.d.ts'
  ]
};
