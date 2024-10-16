import { ConfigEnv, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import Unocss from 'unocss/vite'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }: ConfigEnv) => {
	const env = loadEnv(mode, process.cwd(), '')

	return {
		test: {
			globals: true,
			environment: 'jsdom',
		},
		plugins: [
			react(),
			Unocss({
				presets: [
					presetUno(),
					presetAttributify(),
					presetIcons(),
				]
			}),
			// Add more plugins here as needed
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
		build: {
			outDir: "dist",
			// minify: env.VITE_MINIFY || "esbuild",
			terserOptions: env.VITE_MINIFY === 'terser' ? {
				compress: {
					drop_console: env.VITE_DROP_CONSOLE === 'true',
					drop_debugger: true
				}
			} : undefined,
			rollupOptions: {
				output: {
					chunkFileNames: "assets/js/[name]-[hash].js",
					entryFileNames: "assets/js/[name]-[hash].js",
					assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
				}
			},
		},
		// Add more configuration options here as needed
	}
})
