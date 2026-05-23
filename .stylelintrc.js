export default {
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      customSyntax: 'postcss-styled-syntax',
    },
  ],
  ignoreFiles: [
    '**/node_modules/**',
    '**/dist/**',
    '**/public/**',
    '**/dev-dist/**',
    '**/assets/**',
  ],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-clean-order',
  ],
  plugins: ['stylelint-order', 'stylelint-high-performance-animation'],
  rules: {
    // 允许 css 变量使用任意命名方式
    'custom-property-pattern': null,
    // 允许任意类型的命名方式
    'selector-class-pattern': null,
    // 允许任意类型的 id 选择器命名方式
    'selector-id-pattern': null,
    // 允许任意类型的动画帧命名方式
    'keyframes-name-pattern': null,
    // 允许重复的 css 动画帧
    'keyframe-block-no-duplicate-selectors': null,

    // 防止使用低性能的动画和过度属性
    'plugin/no-low-performance-animation-properties': true,

    'import-notation': 'string',
  },
};
