module.exports = {
  ignoreFiles: ['**/node_modules/**/*.css', '**/dist/**/*.css'],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-clean-order',
    'stylelint-config-prettier',
  ],
  plugins: [
    'stylelint-prettier',
    'stylelint-order',
    'stylelint-high-performance-animation',
  ],
  rules: {
    // 启用 prettier
    'prettier/prettier': [true, { severity: 'warning' }],

    // 允许 css 变量使用任意命名方式
    'custom-property-pattern': null,
    // 允许任意类型的类名命名方式
    'selector-class-pattern': null,

    // 防止使用低性能的动画和过度属性
    'plugin/no-low-performance-animation-properties': true,
  },
};
