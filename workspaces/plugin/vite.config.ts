import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";
import { builtinModules } from "node:module";

export default defineConfig({
	plugins: [dtsPlugin({ skipDiagnostics: true })],
	build: {
		minify: false,
		lib: {
			fileName: "index",
			entry: "src/index.ts",
			formats: ["es", "cjs"],
		},
		rollupOptions: {
			external: [
				"vite",
				...builtinModules,
				...builtinModules.map((m) => `node:${m}`),
			],
			output: {
				exports: "named",
			},
		},
	},
});
