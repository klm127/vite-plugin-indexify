import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";

export default defineConfig({
	plugins: [dtsPlugin({ skipDiagnostics: true })],
	build: {
		minify: false,
		lib: {
			fileName: "index",
			entry: "src/index.ts",
			formats: ["es", "cjs"],
		},
	},
});
