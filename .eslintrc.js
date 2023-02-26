/** JS 和 TS 公用的规则 */
const publicConfig = {
  plugins: ['prettier'],
  rules: {
    // 启用 prettier
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        trailingComma: 'all',
        htmlWhitespaceSensitivity: 'strict',
        plugins: [require('prettier-plugin-tailwindcss')],
      },
    ],

    // 允许在顶层外使用 require
    'global-require': 'off',
    // eslint-plugin-jsdoc 还无法识别出 TS 定义的接口
    'jsdoc/no-undefined-types': 'off',
    // 不强制要求 jsdoc
    'jsdoc/require-jsdoc': 'off',
    // TS 不需要写明类型注释
    'jsdoc/require-param-type': 'off',
    'jsdoc/require-returns-type': 'off',
    // 允许使用其他的 jsdoc 标签，以便使用 typescript-json-schema
    'jsdoc/check-tag-names': 'off',
    'jsdoc/check-param-names': ['warn', { checkDestructured: false }],
    // 允许不写返回值
    'jsdoc/require-returns': 'off',
    // 允许有参数不被写明
    'jsdoc/require-param': 'off',

    // 允许使用下划线命名
    'no-underscore-dangle': 'off',
    // 允许 console
    'no-console': 'off',
    // 允许 continue
    'no-continue': 'off',

    // 允许 any 类型的分配
    'no-unsafe-assignment': 'off',
    // 允许在 while 的条件语句里使用括号来赋值
    'no-cond-assign': ['off', '"except-parens"'],

    // 不检查导入模块的扩展名
    'import/extensions': 'off',
    // 禁止提醒将唯一 export 改为 default export
    'import/prefer-default-export': 'off',
    // 允许使用 require
    'import/no-dynamic-require': 'off',
    'import/no-unresolved': 'off',
  },
};

// eslint-disable-next-line jsdoc/require-param
/** 与公用规则合并 */
const buildConfig = ({ plugins = [], rules = {}, ...otherConfig }) => ({
  ...otherConfig,
  plugins: [...publicConfig.plugins, ...plugins],
  rules: { ...publicConfig.rules, ...rules },
});

module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  ignorePatterns: [
    'dist',
    'node_modules',
    '!.stylelintrc.js',
    '!.postcssrc.js',
  ],
  overrides: [
    buildConfig({
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./packages/*/tsconfig.json'],
      },
      plugins: ['@typescript-eslint', 'jsdoc'],
      extends: [
        'airbnb',
        'airbnb/hooks',
        'plugin:jsdoc/recommended',
        'plugin:import/typescript',
        // 'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        // 'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
      ],
      rules: {
        // 使用 TS 的规则
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { varsIgnorePattern: 'React' },
        ],

        // 允许 switch 中不使用 default
        'default-case': 'off',
        // 允许自增自减
        'no-plusplus': 'off',

        // 自动将直接 import 的类型改为用 import type 导入
        '@typescript-eslint/consistent-type-imports': ['warn', {}],

        // 允许使用 require 导入模块。方便 Bluebird 对其进行包装
        '@typescript-eslint/no-var-requires': 'off',
        // 允许不声明函数返回类型
        '@typescript-eslint/explicit-function-return-type': 'off',
        // 允许使用未注释的空函数
        '@typescript-eslint/no-empty-function': 'off',
        // 允许匿名的异步立即执行函数
        '@typescript-eslint/no-floating-promises': [
          'warn',
          { ignoreIIFE: true },
        ],
        // 允许不显式写出导出函数的返回类型
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        // 禁止提醒非空断言
        '@typescript-eslint/no-non-null-assertion': 'off',
        // 禁止提醒在模板表达式中使用了非字符串类型
        '@typescript-eslint/restrict-template-expressions': 'off',
        // 禁用 TS 的 camelcase，用 JS 的就够了
        '@typescript-eslint/camelcase': 'off',
        // 允许在 TS 允许且我已经正确处理的地方使用 Promise
        '@typescript-eslint/no-misused-promises': 'off',

        // 禁止提醒使用了 any
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        // 允许访问 any 类型属性
        '@typescript-eslint/no-unsafe-member-access': 'off',
        // 允许调用 any 类型变量
        '@typescript-eslint/no-unsafe-call': 'off',
        // 允许分配 any 类型变量
        '@typescript-eslint/no-unsafe-assignment': 'off',

        //
        // React 适配
        //

        // 使此规则支持 TS
        'react/jsx-filename-extension': [
          'warn',
          { extensions: ['.tsx', '.jsx'] },
        ],
        'react/function-component-definition': [
          'warn',
          {
            namedComponents: 'arrow-function',
            unnamedComponents: 'arrow-function',
          },
        ],
        // 有 TS 不需要这个
        'react/prop-types': 'off',
        // 允许使用对象解构来传输 props
        'react/jsx-props-no-spreading': 'off',

        // 为了使用 immer，允许为 命名为state、draft开头、Ele结尾 的函数参数赋值
        'no-param-reassign': [
          'error',
          {
            props: true,
            ignorePropertyModificationsFor: ['state'],
            ignorePropertyModificationsForRegex: ['^draft', 'Ele$'],
          },
        ],

        // 不强制要求为可选参数加上默认值
        'react/require-default-props': 'off',

        // 不强制要求可点击元素必须同时监听键盘操作
        'jsx-a11y/click-events-have-key-events': 'off',
        // 不要求 a11y
        'jsx-a11y/no-static-element-interactions': 'off',
      },
    }),
    buildConfig({
      files: ['*.js'],
      extends: ['eslint:recommended', 'airbnb', 'plugin:prettier/recommended'],
      rules: {
        // 禁止提醒使用了 dev 的包
        'import/no-extraneous-dependencies': 'off',
      },
    }),
  ],
};
