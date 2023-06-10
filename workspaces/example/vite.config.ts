import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import indexify from "vite-plugin-indexify-public";
export default defineConfig({
	plugins: [react(), indexify()],
	publicDir: undefined,
	build: {
		rollupOptions: {
			output: {
				entryFileNames: "assets/js/bundles/[name].bundle.js",
				assetFileNames: "assets/[ext]/[name].[ext]",
			},
		},
	},
});
