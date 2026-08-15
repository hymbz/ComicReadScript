import i18nextPlugin from 'eslint-plugin-i18next';
import solidPlugin from 'eslint-plugin-solid';
import { defineConfig } from 'oxlint';

import packlistData from './scripts/lib/packlist.json' with { type: 'json' };

export default defineConfig({
  plugins: [
    'oxc',
    'typescript',
    'promise',
    'unicorn',
    'import',
    'jsdoc',
    'vitest',
  ],
  jsPlugins: [
    'eslint-plugin-solid',
    'eslint-plugin-i18next',
    './scripts/lint-plugin/restricted-relative-imports.mjs',
  ],
  categories: {
    correctness: 'error',
    suspicious: 'error',
    pedantic: 'warn',
    perf: 'warn',
    style: 'warn',
    // restriction: 'warn',
  },
  env: {
    browser: true,
    worker: true,
    es2026: true,
  },
  rules: {
    ...solidPlugin.configs.recommended.rules,
    ...i18nextPlugin.configs.recommended.rules,

    // Core

    // 禁用禁止使用对象展开/剩余属性语法
    'oxc/no-rest-spread-properties': 'off',
    // 要求函数所有代码路径都有一致的返回值行为
    'consistent-return': 'off', // 交给 TS 的 noImplicitReturns 处理就好了
    // 要求注释以大写字母开头
    'capitalized-comments': 'off',
    // 要求所有控制语句使用花括号
    curly: 'off',
    // 禁止使用 TODO、FIXME 等警告注释
    'eslint/no-warning-comments': 'off',
    // 要求正则表达式使用 Unicode 标志
    // TODO: TS 修复 v 标志的解析 bug 后改回 v
    'eslint/require-unicode-regexp': ['warn', { requireFlag: 'u' }],
    // 要求或禁止函数表达式有名称，仅在需要时命名
    'func-names': ['error', 'as-needed'],
    // 强制使用函数表达式而非函数声明
    'func-style': ['error', 'expression'],
    // 强制标识符的最小/最大长度
    'id-length': 'off',
    // 要求或禁止在变量声明时初始化
    'init-declarations': 'off',
    // 限制每个文件中的最大类数量
    'max-classes-per-file': 'off',
    // 限制文件的最大行数
    'max-lines': 'off',
    // 限制函数的最大行数
    'max-lines-per-function': 'off',
    // 限制函数中的最大语句数
    'max-statements': 'off',
    // 要求构造函数名以大写字母开头
    'new-cap': [
      'error',
      {
        // 是否允许不通过 new 调用大写开头的函数
        capIsNew: false,
      },
    ],
    // 禁止在 Promise executor 中使用 async 函数
    'no-async-promise-executor': 'off',
    // 禁止在循环中使用 await
    'no-await-in-loop': 'off',
    // 禁止使用 console
    'no-console': 'off',
    // 禁止使用 continue 语句
    'no-continue': 'off',
    // 禁止使用 debugger 语句
    'no-debugger': 'off',
    // 禁止行内注释（// 与代码在同一行）
    'no-inline-comments': 'off',
    // 禁止使用魔法数字（无语义的数字字面量）
    'no-magic-numbers': 'off',
    // 禁止使用 javascript: URL
    'no-script-url': 'off',
    // 禁止变量名覆盖外层作用域的同名变量
    'no-shadow': [
      'error',
      {
        // 初始化时（如 let x = x）覆盖的变量不报错
        ignoreOnInitialization: true,
        // 允许覆盖这些名称
        allow: ['_'],
      },
    ],
    // 禁止使用三元运算符
    'no-ternary': 'off',
    // 禁止无副作用的表达式，但允许标签模板
    'no-unused-expressions': ['error', { allowTaggedTemplates: true }],
    // 禁止声明但未使用的变量
    'no-unused-vars': [
      'warn',
      {
        // 检查所有参数
        args: 'all',
        // 忽略以 _ 开头的参数名
        argsIgnorePattern: '^_',
        // 忽略以 _ 开头的变量名
        varsIgnorePattern: '^_',
        // 忽略以 _ 开头的 catch 错误名
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    // 要求或禁止将多个变量合并为一条声明语句
    'one-var': 'off',
    // 要求使用 const 声明不会被重新赋值的变量
    'prefer-const': [
      'error',
      {
        // 解构中的所有变量也必须使用 const
        destructuring: 'all',
      },
    ],
    // 强制 import 语句按规则排序
    'sort-imports': [
      'warn',
      {
        // 是否忽略大小写
        ignoreCase: false,
        // 是否忽略声明排序
        ignoreDeclarationSort: true,
        // 是否忽略成员排序
        ignoreMemberSort: false,
        // 成员语法排序顺序：none > all > multiple > single
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        // 是否允许分组
        allowSeparatedGroups: false,
      },
    ],
    // 要求对象属性键按字母顺序排序
    'sort-keys': 'off',
    // 要求变量声明按字母顺序排序
    'sort-vars': 'off',
    // 要求或禁止 Yoda 条件（如 if ('red' === color)）
    yoda: 'error',

    // TypeScript

    // 禁止不必要的类型参数（能被推断的泛型参数）
    'no-unnecessary-type-parameters': 'off',
    // 强制一致地使用索引对象类型，要求 Record 风格
    'typescript/consistent-indexed-object-style': ['error', 'record'],
    // 强制一致地使用 type 或 interface 定义类型
    'typescript/consistent-type-definitions': ['warn', 'type'],
    // 强制一致地使用 type import
    'typescript/consistent-type-imports': [
      'error',
      {
        // 是否禁止类型注解（如 import { type Foo }）
        disallowTypeAnnotations: false,
        // 自动修复时内联 type 标注
        fixStyle: 'inline-type-imports',
        // 偏好使用 type 导入
        prefer: 'type-imports',
      },
    ],
    // 禁止在期望返回值的位置使用 void 表达式
    'typescript/no-confusing-void-expression': 'off',
    // 禁止没有 await/then/catch 的浮动 Promise
    'typescript/no-floating-promises': [
      'error',
      {
        // 忽略 IIFE 内的浮动 Promise
        ignoreIIFE: true,
        allowForKnownSafeCalls: [
          {
            from: 'file',
            name: ['setup', 'setupSiteAdapter'],
            path: './src/userscript/core/siteAdapter.ts',
          },
        ],
      },
    ],
    // 禁止错误使用 Promise（如在条件判断中误用）
    'typescript/no-misused-promises': 'off',
    // 禁止将 any 类型的值作为函数参数
    'typescript/no-unsafe-argument': 'off',
    // 禁止将 any 类型的值赋值给变量
    'typescript/no-unsafe-assignment': 'off',
    // 禁止调用 any 类型的值
    'typescript/no-unsafe-call': 'off',
    // 禁止访问 any 类型值的成员
    'typescript/no-unsafe-member-access': 'off',
    // 禁止返回 any 类型的值
    'typescript/no-unsafe-return': 'off',
    // 禁止不安全的类型断言
    'typescript/no-unsafe-type-assertion': 'off',
    // 要求使用 ?? 代替 || 进行空值合并
    'typescript/prefer-nullish-coalescing': 'off',
    // 要求函数参数类型为 readonly
    'typescript/prefer-readonly-parameter-types': 'off',
    // 要求或禁止在返回值中使用 await
    'typescript/return-await': [
      'error',
      // 仅在 try-catch 等错误处理场景要求 await
      'error-handling-correctness-only',
    ],
    // 要求布尔表达式使用严格的类型检查
    'typescript/strict-boolean-expressions': 'off',
    // 禁止在 void 返回类型的函数中返回非 void 值
    'typescript/strict-void-return': 'off',
    // 要求 switch 语句覆盖所有可能的值（穷举检查）
    'typescript/switch-exhaustiveness-check': 'off',
    // 禁止在非绑定的上下文中调用类方法
    'typescript/unbound-method': [
      'warn',
      {
        // 忽略静态方法
        ignoreStatic: true,
      },
    ],

    // JSDoc

    // 检查 JSDoc 标签名称的有效性
    'jsdoc/check-tag-names': 'off',
    // 要求有返回值的函数 JSDoc 注释中包含 @param 标签
    'jsdoc/require-param': 'off',
    // 要求 @param 标签声明参数类型
    'jsdoc/require-param-type': 'off',
    // 要求有返回值的函数 JSDoc 注释中包含 @returns 标签
    'jsdoc/require-returns': 'off',
    // 要求 @returns 标签声明返回类型
    'jsdoc/require-returns-type': 'off',
    // 要求 @throws 标签声明抛出的异常类型
    'jsdoc/require-throws-description': 'off',

    // Unicorn

    // 禁止显式指定 setTimeout/setInterval 的 delay 参数
    'unicorn/explicit-timer-delay': ['warn', 'never'],
    // 要求将函数定义移到尽可能高的作用域
    'unicorn/consistent-function-scoping': 'off',
    // 强制文件名大小写风格
    'unicorn/filename-case': 'off',
    // 限制嵌套函数调用的最大深度
    'unicorn/max-nested-calls': 'off',
    // 禁止直接传递数组方法回调引用（如 arr.forEach(fn)）
    'unicorn/no-array-callback-reference': 'off',
    // 禁止使用 null，推荐使用 undefined
    'unicorn/no-null': 'off',
    // 禁止不可读的数组解构（如 const [,,foo] = arr）
    'unicorn/no-unreadable-array-destructuring': 'off',
    // 禁止无用的 undefined（如数组/对象中冗余的 undefined 值）
    'unicorn/no-useless-undefined': [
      'warn',
      {
        // 是否检查函数参数中的 undefined
        checkArguments: false,
      },
    ],
    // 要求使用 addEventListener 代替 on* 属性
    'unicorn/prefer-add-event-listener': 'off',
    // 要求使用 globalThis 代替 window/global/self
    'unicorn/prefer-global-this': 'off',
    // 要求使用 querySelector 代替其他 DOM 查询方法
    'unicorn/prefer-query-selector': 'off',
    // 要求使用顶层 await
    'unicorn/prefer-top-level-await': 'off',
    // 要求在 switch case 子句中使用花括号
    'unicorn/switch-case-braces': 'off',
    // 禁止将 await 表达式的结果作为成员表达式的一部分
    'unicorn/no-await-expression-member': 'off',

    // Promise

    // 禁止使用 new Promise 创建 Promise
    'promise/avoid-new': 'off',
    // 禁止 Promise 被多次 resolve/reject
    'promise/no-multiple-resolved': 'off',
    // 要求使用 async/await 代替回调
    'promise/prefer-await-to-callbacks': 'off',
    // 要求使用 async/await 代替 then/catch
    'promise/prefer-await-to-then': 'off',

    // Test (jest & vitest)

    // 禁止在测试中使用条件语句（if/switch 等）
    'jest/no-conditional-in-test': 'off',
    'vitest/no-conditional-in-test': 'off',
    // 禁止使用测试 hooks（beforeEach/afterEach 等）
    'jest/no-hooks': 'off',
    'vitest/no-hooks': 'off',
    // 禁止在测试文件顶层使用 expect（应放在测试用例内）
    'jest/no-standalone-expect': 'off',
    'vitest/no-standalone-expect': 'off',
    // 要求使用 expect.assertions() 或 expect.hasAssertions()
    'jest/prefer-expect-assertions': 'off',
    'vitest/prefer-expect-assertions': 'off',
    // 要求使用 setup/teardown hooks
    'jest/require-hook': 'off',
    'vitest/require-hook': 'off',
    // 禁止在单个测试中使用过多的 expect
    'jest/max-expects': 'off',
    'vitest/max-expects': 'off',
    // 要求使用严格的布尔匹配器（toBeTrue/toBeFalse）
    'vitest/prefer-strict-boolean-matchers': 'error',
    // 要求使用 toBeFalsy 代替 toBe(false)
    'vitest/prefer-to-be-falsy': 'off',
    // 要求使用 toBeTruthy 代替 toBe(true)
    'vitest/prefer-to-be-truthy': 'off',

    // Solid

    // 禁止在 JSX 中使用 javascript: URL
    'solid/jsx-no-script-url': 'off',
    // 确保 Solid.js 的响应式规则（如跟踪状态使用）
    'solid/reactivity': 'off',

    // i18next

    // 禁止硬编码的字符串字面量，要求使用 i18n 翻译函数
    'i18next/no-literal-string': [
      'error',
      {
        // 仅检查 JSX 中的字符串，不检查普通 JS 代码
        mode: 'jsx-only',
        'jsx-attributes': {
          // 需要检查的 JSX 属性（name、children、textContent、text 及匹配正则的属性）
          include: ['^name', 'children', 'textContent', 'text'],
        },
        callees: {
          // 排除这些函数调用中的字符串参数
          exclude: ['bindOption', 't'],
        },
      },
    ],

    // Import

    // 禁止使用默认导出
    'import/no-default-export': 'off',
    // 禁止模块之间的循环依赖
    'import/no-cycle': 'warn',
    // 强制一致地使用 type 导入风格，type 标注内联在导入语句中
    'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
    // 要求所有 export 语句放在文件末尾
    'import/exports-last': 'off',
    // 要求或禁止导入时带文件扩展名
    'import/extensions': 'off',
    // 要求分组 export 语句
    'import/group-exports': 'off',
    // 限制每个文件的最大依赖数量
    'import/max-dependencies': 'off',
    // 禁止命名导出（export { foo }）
    'import/no-named-export': 'off',
    // 禁止使用命名空间导入（import * as ns）
    'import/no-namespace': 'off',
    // 禁止未赋值的副作用导入（import 'xxx'）
    'import/no-unassigned-import': 'off',
    // 要求使用默认导出（export default）
    'import/prefer-default-export': 'off',
    // 禁止通过相对路径或子模块形式导入 packlist 中的模块
    'restricted-relative-imports/no-restricted-relative-imports': [
      'warn',
      Object.fromEntries(
        packlistData.packlist
          .filter((p) => p !== 'helper/languages')
          .map((p) => [
            p,
            {
              srcPath: `src/${p}`,
              ...(p === 'helper' ? { allowed: ['helper/languages'] } : {}),
            },
          ]),
      ),
    ],
  },
  overrides: [
    {
      // 非 src 目录下的脚本文件在 Node.js 环境中运行
      files: ['*.ts', '*.js', '!src/**/*', 'src/pwa/vite.config.mts'],
      env: { node: true },
      rules: {
        // 允许导入 Node.js 内置模块
        'import/no-nodejs-modules': 'off',
        // 允许使用 __dirname 等带下划线的变量名
        'no-underscore-dangle': 'off',
      },
    },
    {
      files: ['src/site/**/*'],
      rules: {
        // 站点专属文案不需要 i18n
        'i18next/no-literal-string': 'off',
        'no-restricted-imports': [
          'warn',
          {
            patterns: [
              {
                group: [
                  '*/**/*',
                  '!solid-js/**/*',
                  '!components/**/*',
                  '!userscript/**/*',
                  '!@material*/**/*',
                  '../**/*',
                  '!.*/**/*',
                ],
                message: '只能通过 core 导入',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['**/*.test.*'],
      rules: {
        'no-console': 'off',
        'no-debugger': 'off',
        // 禁用 jest 导入规则，因为使用的是 vitest
        'jest/prefer-importing-jest-globals': 'off',
        // 强制一致地使用 it
        'jest/consistent-test-it': [
          'error',
          { fn: 'it', withinDescribe: 'it' },
        ],
        'vitest/consistent-test-it': [
          'error',
          { fn: 'it', withinDescribe: 'it' },
        ],
        // 允许使用显式导入的 vitest 全局函数
        'vitest/prefer-importing-vitest-globals': 'off',
        // 禁用禁止导入 vitest 全局函数的规则
        'vitest/no-importing-vitest-globals': 'off',
      },
    },
    {
      files: ['**/*.stories.*'],
      rules: {
        // 禁止匿名默认导出
        'import/no-anonymous-default-export': 'off',
        // 允许使用硬编码字符串
        'i18next/no-literal-string': 'off',
      },
    },
  ],
  ignorePatterns: [
    '**/dist/**',
    '**/public/**',
    '**/dev-dist/**',
    '**/assets/**',
    '**/**.js',
    '**/**.mjs',
    'ComicReader.umd.d.ts',
  ],
  options: {
    typeAware: true,
    typeCheck: true,
  },
});
