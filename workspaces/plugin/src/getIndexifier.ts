import fs from "node:fs";
import path from "node:path";
import { normalizePath } from "vite";

/**
 * The plugin-specific options for indexify.
 *
 * @example
 * ```js
 * indexify([{
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
 *  }])
 * ```
 */
export type IndexifyOptions = Array<IndexifyDirectoryOptions>;
export interface IndexifyDirectoryOptions {
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
}
interface IndexifyOutput {
	/** The name of the entry */
	name: string;
	/** Whether this entry represents a directory */
	isDirectory: boolean;
	/** If the entry is a directory, and 'recurseFlat' was not true, it will contain further indexifyOutput entries for all files in that directory. If 'recurse' was false, it will be empty.  */
	dirContents?: IndexifyOutput[];
}

const DEFAULT_OPTIONS: IndexifyDirectoryOptions = {
	directory: ".",
	includeSubdirs: false,
	indexFileName: "index.json",
	recurse: true,
};

/** Gets the indexifying function, configured based on the options. */
export default function getIndexifier(
	indexifyOptionsParam: IndexifyOptions = [],
	outDir?: string
) {
	if (outDir === undefined) {
		// This function shouldn't ever be called
		return () => {
			console.warn(
				"vite-plugin-indexify-public: No output directory identified."
			);
		};
	}
	if (indexifyOptionsParam.length === 0) {
		indexifyOptionsParam.push(DEFAULT_OPTIONS);
	}
	return () => {
		for (let entry of indexifyOptionsParam) {
			const full_entry = { ...DEFAULT_OPTIONS, ...entry };
			const validator = getIndexifyValidator(full_entry);
			const target_path = path.join(outDir, full_entry.directory);
			indexify(target_path, full_entry, validator);
		}
	};
}

/** Creates the indexify entries and writes them to the indexing file. */
function indexify(
	valid_dir_path: string,
	options: IndexifyDirectoryOptions,
	validate: TDirentValidator
) {
	const entries: IndexifyOutput[] = [];
	try {
		const dirents = fs.readdirSync(valid_dir_path, { withFileTypes: true });
		for (let dirent of dirents) {
			if (validate(dirent)) {
				if (dirent.isFile()) {
					entries.push({
						name: dirent.name,
						isDirectory: false,
					});
				} else {
					if (options.includeSubdirs!) {
						entries.push({
							name: dirent.name,
							isDirectory: true,
						});
					}
					if (options.recurse) {
						indexify(path.join(valid_dir_path, dirent.name), options, validate);
					}
				}
			}
		}
	} catch (e) {
		console.error("vite-plugin-indexify-public : error reading directory. ", e);
	}
	const outpath = path.join(valid_dir_path, options.indexFileName!);
	fs.writeFileSync(outpath, JSON.stringify(entries, undefined, 4));
	console.log("\n" + normalizePath(path.relative(".", outpath)));
}

type TDirentValidator = (name: fs.Dirent) => boolean;

/** Gets a validator function for an entry in the directories array */
function getIndexifyValidator(directoryOptions: IndexifyDirectoryOptions) {
	let include = (name: string) => true;
	let exclude = (name: string) => false;
	if (directoryOptions.exclude) {
		include = (name: string) => directoryOptions.exclude!.test(name);
	}
	if (directoryOptions.include) {
		include = (name: string) => directoryOptions.include!.test(name);
	}
	return function (dirent: fs.Dirent) {
		return include(dirent.name) && !exclude(dirent.name);
	};
}
