module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true,
    'node': true,
    'shared-node-browser': true,
    'jquery': true,
  },
  'globals': {
    'GM_registerMenuCommand': false,
    'GM_getResourceText': false,
    'GM_xmlhttpRequest': false,
    'GM_notification': false,
    'GM_deleteValue': false,
    'GM_listValues': false,
    'GM_setValue': false,
    'GM_getValue': false,
    'GM_addStyle': false,
    'GM_info': false,
    'unsafeWindow': false,
    'Vue': false,
    'JSZip': false,
    'saveAs': false,
    'ComicReadWindow': false,
    'ScriptMenu': false,
    'appendDom': false,
    'getTop': false,
    'loadComicReadWindow': false,
    'loadExternalScripts': false,
    'loadScriptMenu': false,
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module',
  },
  'rules': {
    // Possible Errors
    'no-console': 'warn',
    // 禁止不必要的括号
    'no-extra-parens': ['warn', "all", { "nestedBinaryExpressions": false }],
    // 禁止在常规字符串中出现模板字面量占位符语法
    'no-template-curly-in-string': 'warn',
    // 强制使用有效的 JSDoc 注释
    'valid-jsdoc': [
      'warn',
      {
        // 只在有使用 return 语句是要求一个返回标签
        'requireReturn': false,
      },
    ],

    // Best Practices
    // 强制类方法使用 this
    'class-methods-use-this': 'warn',
    // 尽量使用点号访问属性
    'dot-notation': 'warn',
    // 使用 === 和 !==
    'eqeqeq': 'error',
    // 禁止在 else 前有 return
    'no-else-return': 'warn',
    // 禁止出现空函数
    'no-empty': 'warn',
    // 禁止不必要的函数绑定
    'no-extra-bind': 'warn',
    // 禁止使用短符号进行类型转换
    'no-implicit-coercion': 'warn',
    // 禁止出现多个空格
    'no-multi-spaces': 'warn',
    // 禁止多余的 return 语句
    'no-useless-return': 'warn',
    // 禁止 Yoda 条件
    'yoda': 'warn',

    // Stylistic Issues
    // 禁止在括号内使用空格
    'array-bracket-spacing': 'warn',
    // 在代码块中开括号前和闭括号后有空格
    'block-spacing': 'warn',
    // 使用 one true brace style 风格的大括号
    'brace-style': ['warn','1tbs' ,{ "allowSingleLine": true }],
    // 使用拖尾逗号
    'comma-dangle': [
      'warn',
      'always-multiline',
    ],
    // 强制在逗号周围使用空格
    'comma-spacing': 'warn',
    // 禁止在计算属性中使用空格
    'computed-property-spacing': 'warn',
    // 要求或禁止文件末尾保留一行空行
    'eol-last': 'warn',
    // 禁止在函数标识符和其调用之间有空格
    'func-call-spacing': 'warn',
    // 使用函数表达式而不是声明
    'func-style': 'error',
    // 如果函数的任一参数有换行，则要求在函数括号内换行。否则禁止换行。
    'function-paren-newline': 'warn',
    // 使用 2 缩进
    'indent': [
      'error',
      2,
      {
        // switch 语句中的 case 子句的缩进 1
        'SwitchCase': 1,
      },
    ],
    // 强制在 JSX 属性中使用双引号
    'jsx-quotes': 'warn',
    // 强制在对象字面量的键和值之间使用一致的空格
    'key-spacing': 'warn',
    // 强制关键字周围空格的一致性
    'keyword-spacing': 'warn',
    // 要求或禁止在三元操作数中间换行
    'multiline-ternary': ["error", "always-multiline"],
    // 要求构造函数首字母大写
    'new-cap': ['error',{ "capIsNew": false }],
    // 禁止混合使用不同的操作符
    'no-mixed-operators': 'warn',
    // 禁用行尾空白
    'no-trailing-spaces': 'warn',
    // 禁止可以在有更简单的可替代的表达式时使用三元操作符
    'no-unneeded-ternary': 'warn',
    // 禁止属性前有空白
    'no-whitespace-before-property': 'warn',
    // 要求单行语句之前有换行
    'nonblock-statement-body-position': ['warn', 'below'],
    // 如果在属性内部或属性之间有换行符，就要求有换行符
    'object-curly-newline': ['error', { 'multiline': true }],
    // 不允许花括号中有空格
    'object-curly-spacing': 'warn',
    // 强制将对象的属性放在不同的行上
    'object-property-newline': 'warn',
    // 强制变量分开声明
    'one-var': [
      'error',
      'never',
    ],
    // 尽可能地简化赋值操作
    'operator-assignment': 'warn',
    // 将操作符放在行首位置
    'operator-linebreak': ['warn', 'before'],
    // 对象字面量属性名称尽量不使用引号
    'quote-props': ['error', 'as-needed'],
    // 尽量使用单引号
    'quotes': [
      'warn',
      'single',
      { "avoidEscape": true }
    ],
    // 使用分号结尾
    'semi': ["error", "always", { "omitLastInOneLineBlock": true}],
    // 在语句块之前有空格
    'space-before-blocks': 'warn',
    // 在函数圆括号之前有一个空格
    'space-before-function-paren': 'warn',
    // 强制圆括号内没有空格
    'space-in-parens': 'warn',
    // 要求操作符周围有空格
    'space-infix-ops': 'warn',
    // 强制 words 一元操作符后空格和 nonwords 一元操作符之前或之后的空格的一致性
    'space-unary-ops': 'warn',
    // 要求在注释前有空白
    'spaced-comment': 'warn',
    // 强制在 switch 的冒号左右有空格
    'switch-colon-spacing': 'warn',

    // ECMAScript 6
    // 要求箭头函数体尽量不使用大括号
    'arrow-body-style': 'warn',
    // 要求箭头函数的箭头前后有空格
    'arrow-spacing': 'warn',
    // 强制 generator 函数中 * 号周围有空格
    'generator-star-spacing': ['warn', { 'before': false, 'after': true }],
    // 禁止重复模块导入
    'no-duplicate-imports': 'warn',
    // 禁用不必要的构造函数
    'no-useless-constructor': 'warn',
    // 禁止在对象中使用不必要的计算属性
    'no-useless-computed-key': 'error',
    'no-var': 'error',
    // 要求对象字面量中方法和属性使用简写语法
    'object-shorthand': 'warn',
    // 要求使用 const 声明那些声明后不再被修改的变量
    'prefer-const': 'error',
    // 优先使用对象解构
    'prefer-destructuring': [
      'error',
      { 'array': false },
    ],
    // 禁用 parseInt() 和 Number.parseInt()，使用二进制，八进制和十六进制字面量
    'prefer-numeric-literals': 'error',
    // 要求使用剩余参数而不是 arguments
    'prefer-rest-params': 'error',
    // 要求使用模板字面量而非字符串连接
    'prefer-template': 'error',
    // 强制剩余和扩展运算符及其表达式之间有空格
    'rest-spread-spacing': 'warn',
    // 禁止模板字符串中的嵌入表达式周围空格的使用
    'template-curly-spacing': 'warn',
  },
};
