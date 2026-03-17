module.exports = {
//  PostCSS 是使用 javascript 插件转换 CSS 的后处理器, PostCSS 插件是用于在 ‌构建时自动转换和优化 CSS 代码‌ 的 JavaScript 模块
  // 执行顺序： PostCSS 插件按数组顺序执行，所以流程是： @import 解析 → 嵌套语法处理 → Tailwind 生成 → 添加前缀 → 压缩优化
  plugins: [
    require('postcss-import'),
    require('tailwindcss/nesting'),
    require('tailwindcss'),
    require('autoprefixer'),
    require('cssnano'),
  ],
}
