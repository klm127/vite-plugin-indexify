interface IndexifyOutput {
	/** The name of the entry */
	name: string;
	/** Whether this entry represents a directory */
	isDirectory: boolean;
	/** If the entry is a directory, and 'recurseFlat' was not true, it will contain further indexifyOutput entries for all files in that directory. If 'recurse' was false, it will be empty.  */
	dirContents?: IndexifyOutput[];
}

import { type Plugin } from "vite";
import getIndexifier, { type IndexifyOptions } from "./getIndexifier";

/**
 * Indexify creates index.jsons for your output directories.
 *
 * These files can list all or some of the files and/or folders in all or some of your directories.
 *
 * Indexify is passed a list of directories, relative to your output directory, that you want to create an index file for. The following is how it is used in a vite config.
 *
 * @example
 * ```js
 * plugins: [
 * 	indexify([
 * 		{
 * 			directory: "assets/posts",
 * 			includeSubdirs: true
 * 			recurse: true,
 * 			indexFileName: "posts.json"
 * 		},
 * 		{
 * 			directory: "assets/images",
 * 			recurse: false,
 * 		}
 * 	]),
 * ]
 * ```
 *
 * Here is an example output, perhaps `assets/posts/posts.json`:
 * @example
 * ```json
 * [{
 * 	"name": "post1.md",
 * 	"isDirectory": false
 * },{
 * 	"name": "oldPosts",
 * 	"isDirectory": true
 * }]
 * ]
 * ```
 */
export default function indexify(indexifyOptions?: IndexifyOptions): Plugin {
	let iWriter = getIndexifier(indexifyOptions, undefined);
	return {
		name: "indexify-assets",
		version: "0.0.1",
		writeBundle: {
			order: "post",
			handler: () => {
				iWriter();
			},
		},
		outputOptions(options) {
			iWriter = getIndexifier(indexifyOptions, options.dir);
		},
		// configureServer(server) {
		// console.log("\n~~~ configureServer called ~~~");
		// const { config, httpServer } = server;
		// httpServer?.once("listening", () => {
		// 	const { root, base } = config;
		// 	console.log("\n >> root, base: ", root, base);
		// 	const inputs = config.build.rollupOptions.input;
		// 	console.log("\n >> rollupOptions.input: ", inputs);
		// 	console.log("\n >> config.cacheDir ", config.cacheDir);
		// 	console.log("\n >> server middlewares", server.middlewares);
		// 	// fs.writeFileSync(
		// 	// 	path.join(config.cacheDir, "index.json"),
		// 	// 	'{"hi":"hello"}'
		// 	// );
		// 	console.log("\n >> config.publicDir ", config.publicDir);
		// 	console.log("\n >> config.build.outDir", config.build.outDir);
		// });
		// it's probably going to have to work in this area
		// },
	};
}
