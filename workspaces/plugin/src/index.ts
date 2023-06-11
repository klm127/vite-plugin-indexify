/**
 * The plugin-specific options for indexify.
 *
 * @example
 * ```js
 * indexify({
 *  dirs: [{
 *      directory: 'posts',
 *      indexFileName: 'posts.json',
 *      include: '.*\.md$',
 *      exclude: '.*\.draft.md$'
 *      recurse: true
 *  },{
 *      directory: 'images/fetchable-images',
 *      indexFileName: 'images.json',
 *      recurse: true,
 *      recurseFlat: true
 *  }]
 *
 * })
 * ```
 */
interface IndexifyOptions {
	/** The directories in assets to indexify.  */
	publicSubdirs: IndexifyDirectoryOptions[];
}

interface IndexifyDirectoryOptions {
	/** The directory, relative to 'public', to indexify. */
	directory: string;
	/** The output file name. Defaults to 'index.json' */
	indexFileName?: string;
	/** Only filenames matching this pattern will be indexified. Defaults to all. */
	include?: RegExp;
	/** Filenames matching this pattern will not be indexified. Defaults to none. */
	exclude?: RegExp;
	/** Whether to include directories in the index.json */
	includeSubdirs?: boolean;
	/** Whether to recurse into and indexify subdirectories. They will have the same indexFileName. */
	recurse?: boolean;
	/** Whether to flatten the indexification of subdirectories, e.g., list each filename as a top-level entry in the index.json or list them as nested in each entry. Defaults to flat.*/
	recurseFlat?: boolean;
}

interface IndexifyOutput {
	/** The name of the entry */
	name: string;
	/** Whether this entry represents a directory */
	isDirectory: boolean;
	/** If the entry is a directory, and 'recurseFlat' was not true, it will contain further indexifyOutput entries for all files in that directory. If 'recurse' was false, it will be empty.  */
	dirContents?: IndexifyOutput[];
}

import { type Plugin } from "vite";
import path from "path";
import fs from "fs";
import getIndexifier from "./getIndexifier";

/**
 * Indexify creates index.jsons for your output directories.
 *
 * These files can list all or some of the files and/or folders in all or some of your directories.
 *
 * Example output, perhaps `assets/posts/index.json`:
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
 * 
 * Indexify is passed a list of directories, relative to your output directory, that you want to create an index file for.
 * 
 * @example
 * ```js
 * plugins: [
 * 	indexify({
 * 		publicSubdirs: [
 * 			{
 *				directory: "posts",
 * 				recurse: true,
 * 			},
 * 			{
 * 				directory: "images",
 * 				recurse: false,
 * 				includeSubdirs: true
 * 			}
 * 		],
 * 	}),
 * ]
```
 * 
 */
export default function indexify(indexifyOptions?: IndexifyOptions): Plugin {
	let iWriter = getIndexifier(indexifyOptions, undefined);
	return {
		name: "indexify-assets",
		version: "0.0.1",
		writeBundle: {
			order: "post",
			handler: (options, bundle) => {
				iWriter();
			},
		},
		buildStart(options) {
			console.log("buildStart");
		},
		outputOptions(options) {
			iWriter = getIndexifier(indexifyOptions, options.dir);
		},
		closeBundle() {
			console.log("close bundle");
		},
	};
}
