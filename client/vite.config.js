import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
import path from 'path'

export default defineConfig({
	plugins: [
		react(),
		svgr({
			svgrOptions: {
				icon: true,
				exportType: "named",
				namedExport: "ReactComponent",
			},
		}),
	],
	server: {
		host: true,
		port: 5173,
		strictPort: true,
		cors: true,
		historyApiFallback: true,
	},
	resolve: {
		alias: {
			'@': path.resolve('./src'),
		},
	},
})