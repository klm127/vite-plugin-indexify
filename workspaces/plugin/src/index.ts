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

/** A GREAT LITTLE FUNCTION */
export default function indexify(x?: IndexifyOptions): Plugin {
	const p = x;
	return {
		name: "indexify-assets",
		version: "0.0.1",
		writeBundle(options, bundle) {
			console.log(Object.keys(bundle));
			console.log(options.paths);
			console.log(options.dir);
			for (let k of Object.keys(bundle)) {
				const containing_folder = path.join(
					options.dir ? options.dir : "",
					path.dirname(k)
				);
				console.log(containing_folder);
			}
		},
	};
}
