/** for testing whether the plugin actually works */
import typescript from "@rollup/plugin-typescript";
import indexify from "../dist/index.js";

export default {
	input: "test/test.ts",
	plugins: [typescript(), indexify()],
	output: {
		file: "test/dist/bundle-test.js",
		format: "es",
	},
};
