import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
	},
	plugins: [react()],
	resolve: {
		alias: {
			'@': './src',
		},
	},
})
