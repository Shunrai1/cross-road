import path from 'node:path'
import { partytownVite } from '@builder.io/partytown/utils'

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'

import _config from './_config'

const HOST = _config.server.host
const PORT = _config.server.port

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: HOST,
    port: PORT,
  },
  plugins: [
    legacy(),
    glsl(),
    vue(),
    // - partytownVite : 这是 Partytown 库提供的 Vite 插件。Partytown 用于将第三方脚本（如统计代码、广告代码）从主线程移到 Web Worker 中运行，从而提高网页的加载速度和性能。
    // - dest (destination) : 这个选项告诉插件在构建（build）项目时，将 Partytown 运行所需的库文件复制到哪里。
    // - path.join(__dirname, 'dist', '~partytown') :
    // - 这里指定了目标路径为项目构建输出目录（通常是 dist ）下的 ~partytown 文件夹。
    // - 这意味着当你运行 npm run build 打包项目后，你会在 dist 目录下看到一个名为 ~partytown 的文件夹，里面包含了 Partytown 运行所需的静态文件。
    partytownVite({
      dest: path.join(__dirname, 'dist', '~partytown'),
    }),
  ],
})
