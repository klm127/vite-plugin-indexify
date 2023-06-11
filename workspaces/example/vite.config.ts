import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import indexify from "vite-plugin-indexify-public";
export default defineConfig({
	plugins: [
		react(),
		indexify({
			publicSubdirs: [
				{
					directory: ".",
					recurse: true,
				},
			],
		}),
	],
	publicDir: "public",
	build: {
		rollupOptions: {
			input: ["src/extra.ts", "index.html"],
			output: {
				entryFileNames: "assets/js/bundles/[name].bundle.js",
				assetFileNames: "assets/[ext]/[name].[ext]",
			},
		},
	},
});
