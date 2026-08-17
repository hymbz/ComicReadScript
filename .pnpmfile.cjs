// 临时方案：让 storybook-solidjs-vite 使用 TypeScript 5.9.3，而不是根目录的 TypeScript 7。
// 背景：TS7 根导出不再包含完整编译器 API，storybook-solidjs-vite 仍访问 ts.JsxEmit.Preserve。
// 等 storybook-solidjs-vite 支持 TS7 后，可删除本文件。
module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.name === 'storybook-solidjs-vite') {
        pkg.dependencies = {
          ...pkg.dependencies,
          typescript: '5.9.3',
        };

        if (pkg.peerDependencies) {
          delete pkg.peerDependencies.typescript;
        }
        if (pkg.peerDependenciesMeta) {
          delete pkg.peerDependenciesMeta.typescript;
        }
      }

      return pkg;
    },
  },
};
