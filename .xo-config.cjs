module.exports = {
  prettier: true,
  plugins: ["i18next", "jsdoc", "solid", "no-autofix"],
  extends: ["plugin:solid/typescript", "plugin:jsdoc/recommended"],
  ignores: ["*.js", "*.mjs"],

  rules: {
    // 提示未使用的变量
    "@typescript-eslint/no-unused-vars": "warn",
    // 提示使用了 console
    'no-console': ["warn", { allow: ["warn", "error"] }],
    'no-debugger': "warn",

    "no-use-extend-native/no-use-extend-native": "off",

    // 禁止重新赋值函数参数
    "no-param-reassign": "error",
    // 禁用 prefer-const 的自动修复
    "prefer-const": "off",
    "no-autofix/prefer-const": "warn",

    // 不限制代码深度
    "max-depth": "off",
    // 不限制文件名的大小写样式
    "unicorn/filename-case": "off",
    // 不限制 import 的扩展名
    "import/extensions": "off",
    "n/file-extension-in-import": "off",
    // 不限制循环方式
    // "unicorn/no-array-for-each": "off",
    // 不限制注释首字母大小写
    "capitalized-comments": "off",
    // 不强制使用 addEventListener
    "unicorn/prefer-add-event-listener": "off",
    // 不限制代码复杂性
    complexity: "off",
    // 不强制使用 querySelector
    "unicorn/prefer-query-selector": "off",
    // 不限制在 switch case 中使用大括号
    "unicorn/switch-case-braces": 'off',

    // 允许直接传递函数给迭代器方法
    "unicorn/no-array-callback-reference": "off",
    // 允许使用缩写
    "unicorn/prevent-abbreviations": "off",
    // 允许未分配导入
    "import/no-unassigned-import": "off",
    // 允许默认导入变量名称和导入模块名称不同
    "import/no-named-as-default": "off",
    // 允许在 Promise 中返回值
    "no-promise-executor-return": "off",
    // 允许在循环中使用 await
    "no-await-in-loop": "off",
    // 允许使用 js url
    "no-script-url": "off",
    // 允许 TODO 注释
    "no-warning-comments": "off",
    // 允许 return await
    "no-return-await": "off",
    // 允许调用大写开头的函数
    "new-cap": ["error", { "capIsNew": false }],
    // 允许使用复杂的数组解构
    "unicorn/no-unreadable-array-destructuring": "off",
    // 允许正常调用异步函数并使用 catch
    "unicorn/prefer-top-level-await": "off",

    // import 不同分组之间加上空行
    "import/order": ["warn", { "newlines-between": "always" }],

    // 使用 process
    "n/prefer-global/process": ["error", "always"],


    //
    // 项目特有的规则
    //

    // eslint-plugin-jsdoc 还无法识别出 TS 定义的接口
    "jsdoc/no-undefined-types": "off",
    // 不强制要求 jsdoc
    "jsdoc/require-jsdoc": "off",
    // TS 不需要写明类型注释
    "jsdoc/require-param-type": "off",
    "jsdoc/require-returns-type": "off",
    // 允许使用其他的 jsdoc 标签，以便使用 typescript-json-schema
    "jsdoc/check-tag-names": "off",
    "jsdoc/check-param-names": ["warn", { checkDestructured: false }],
    // 允许不写返回值
    "jsdoc/require-returns": "off",
    // 允许有参数不被写明
    "jsdoc/require-param": "off",

    "solid/reactivity": "off",
  },

  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      rules: {
        // 允许在 void 的函数内 return
        "@typescript-eslint/no-confusing-void-expression": "off",
        // 不限制变量名的大小写样式
        "@typescript-eslint/naming-convention": "off",
        // 不限制类型断言的方式
        "@typescript-eslint/consistent-type-assertions": "off",
        // 不限制类型定义的方式
        "@typescript-eslint/consistent-type-definitions": "off",
        // 不强制使用 for of
        "@typescript-eslint/prefer-for-of": "off",
        // 不禁止类型
        "@typescript-eslint/ban-types": "off",
        // 不强制返回 Promise 的函数使用 async
        "@typescript-eslint/promise-function-async": "off",
        // 不强制换行
        "@typescript-eslint/padding-line-between-statements": "off",

        // 允许 switch 省略部分值
        "@typescript-eslint/switch-exhaustiveness-check": "off",
        // 允许浮动 Promise
        "@typescript-eslint/no-floating-promises": "off",
        // 允许使用空函数
        "@typescript-eslint/no-empty-function": "off",
        // 允许使用 any
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",

        // 允许 return await
        "@typescript-eslint/return-await": [
          "off",
          "error-handling-correctness-only",
        ],

        // 在判断类型时允许使用 ||
        "@typescript-eslint/prefer-nullish-coalescing": [
          "error",
          { ignorePrimitives: true },
        ],

        // 允许短路表达式
        "@typescript-eslint/no-unused-expressions": [
          "error",
          { "allowShortCircuit": true }
        ],

        // 允许使用 require
        "unicorn/prefer-module": "off",
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/no-var-requires": "off",

        "@typescript-eslint/consistent-type-imports": ["error", {
          // 允许 typeof import
          disallowTypeAnnotations: false,
          // 使用 内联类型导入
          fixStyle: "inline-type-imports",
        }],
      }
    },
    {
      files: "**/!(display)*.tsx",
      rules: {
        "i18next/no-literal-string": [
          "error", {
            mode: 'jsx-only',
            'jsx-attributes': { include: ['^name'] },
          }],
      },
    },
  ],
};
