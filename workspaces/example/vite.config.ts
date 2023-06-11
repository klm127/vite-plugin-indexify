import react from "@vitejs/plugin-react";
import { defineConfig, createLogger } from "vite";
import indexify from "vite-plugin-indexify";
export default defineConfig({
	plugins: [
		react(),
		indexify([
			{
				directory: "posts",
				recurse: true,
				includeSubdirs: false,
				include: /.*\.md$/,
			},
		]),
	],
	publicDir: "public",
	build: {
		rollupOptions: {
			input: ["index.html"],
			output: {
				entryFileNames: "assets/js/bundles/[name].bundle.js",
				assetFileNames: "assets/[ext]/[name].[ext]",
			},
		},
	},
});
