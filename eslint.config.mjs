import antfu from '@antfu/eslint-config';
import prettierConflicts from 'eslint-config-prettier';
import i18next from 'eslint-plugin-i18next';
import oxlint from 'eslint-plugin-oxlint';

export default antfu(
  {
    stylistic: { semi: true },
    solid: true,

    prettier: true,
    prettierConflicts,
    i18next,
    oxlint,
    formatters: false,
    jsdoc: false,
    node: false,
    jsonc: false,
    yaml: false,
    markdown: false,
    toml: false,
    vue: false,
    test: false,
    imports: false,
    unicorn: false,

    ignores: ['**/dist/**', '**/public/**', '**/dev-dist/**', '*.user.js'],
  },
  {
    rules: {
      'style/quote-props': ['warn', 'as-needed'],
      'style/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
      'style/member-delimiter-style': [
        'warn',
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false,
          },
          multilineDetection: 'brackets',
        },
      ],
      'style/jsx-curly-newline': 'off',
      'style/jsx-one-expression-per-line': 'off',
      'style/arrow-parens': 'off',

      // 排序相关
      'perfectionist/sort-imports': [
        'warn',
        { newlinesBetween: 1, tsconfig: { rootDir: '.' } },
      ],
      'perfectionist/sort-named-imports': 'warn',
      'import/consistent-type-specifier-style': 'warn',
      'ts/no-import-type-side-effects': 'warn',
      'perfectionist/sort-exports': 'warn',

      'antfu/curly': 'off',
      'antfu/if-newline': 'off',
      'antfu/top-level-function': 'off',
      'antfu/consistent-list-newline': 'off',
      'antfu/consistent-chaining': 'off',
      'antfu/no-top-level-await': 'off',

      'ts/no-use-before-define': 'off',

      'node/prefer-global/process': ['warn', 'always'],

      'solid/jsx-no-script-url': 'off',
      'solid/reactivity': 'off',
      'solid/components-return-once': 'off',

      'prefer-promise-reject-errors': 'off',

      'tunused-imports/no-unused-vars': 'off',
      'unused-imports/no-unused-vars': 'off',

      'no-debugger': 'warn',
    },
  },
  i18next.configs['flat/recommended'],
  {
    files: ['!**/*.stories.tsx'],
    rules: {
      'i18next/no-literal-string': [
        'error',
        {
          mode: 'jsx-only',
          'jsx-attributes': {
            include: ['^name', 'children', 'textContent', 'text'],
          },
          callees: { exclude: ['bindOption', 't'] },
        },
      ],
    },
  },
  prettierConflicts,
  ...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),
)
  .disableRulesFix(['prefer-const', 'unused-imports/no-unused-imports'], {
    builtinRules: () =>
      import('eslint/use-at-your-own-risk').then((r) => r.builtinRules),
  })
  // 一些规则即使在上面 false 了，实际也还是会启用，需要在这里禁用
  // oxc 有的全部禁用交给 oxc
  .removePlugins('node', 'jsdoc', 'vue', 'test', 'import', 'ts', 'unicorn');
