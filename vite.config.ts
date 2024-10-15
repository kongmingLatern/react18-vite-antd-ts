import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import Unocss from 'unocss/vite'
import { presetUno } from 'unocss'
import { presetAttributify } from 'unocss'
import { presetIcons } from 'unocss'
// https://vitejs.dev/config/
export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
	},
	plugins: [react(), Unocss({
		presets: [
			presetUno(),
			presetAttributify(),
			presetIcons(),
		]
	})],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		outDir: "dist",
		// esbuild 打包更快，但是不能去除 console.log，去除 console 使用 terser 模式
		minify: "esbuild",
		// minify: "terser",
		// terserOptions: {
		// 	compress: {
		// 		drop_console: viteEnv.VITE_DROP_CONSOLE,
		// 		drop_debugger: true
		// 	}
		// },
		rollupOptions: {
			output: {
				// Static resource classification and packaging
				chunkFileNames: "assets/js/[name]-[hash].js",
				entryFileNames: "assets/js/[name]-[hash].js",
				assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
			}
		},
	},
})
