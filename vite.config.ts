import type { ConfigEnv } from 'vite'
import path from 'node:path'
import process from 'node:process'
import react from '@vitejs/plugin-react-swc'
import { presetAttributify, presetIcons, presetUno } from 'unocss'
import Unocss from 'unocss/vite'

import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    test: {
      globals: true,
      environment: 'jsdom',
    },
    server: {
      proxy: {
        '^/api': {
          target: env.VITE_APP_API_URL, // 将要代理的目标地址
          changeOrigin: true, // 是否改变源地址
          rewrite: path => path.replace('/api', ''),
        },
      },
    },
    plugins: [
      react(),
      Unocss({
        presets: [
          presetUno(),
          presetAttributify(),
          presetIcons(),
        ],
      }),
      // Add more plugins here as needed
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      // minify: env.VITE_MINIFY || "esbuild",
      terserOptions: env.VITE_MINIFY === 'terser'
        ? {
            compress: {
              drop_console: env.VITE_DROP_CONSOLE === 'true',
              drop_debugger: true,
            },
          }
        : undefined,
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    // Add more configuration options here as needed
  }
})
