import {
	IndexifyDefaultedDirectoryOptions,
	IndexifyDirectoryOptions,
	IndexifyOptions,
	IndexifyOutput,
} from "./types";
import fs from "node:fs";
import path from "node:path";

export default function getIndexifier(
	indexifyOptionsParam?: IndexifyOptions,
	outDir?: string
) {
	if (outDir === undefined) {
		return () => {
			console.warn(
				"vite-plugin-indexify-public: No output directory identified."
			);
		};
	}
	let indexifyOptions: IndexifyOptions = indexifyOptionsParam!;
	if (indexifyOptionsParam === undefined) {
		indexifyOptions = {
			publicSubdirs: [
				{
					directory: ".",
					recurse: true,
				},
			],
		};
	}
	return () => {
		for (let entry of indexifyOptions.publicSubdirs) {
			const validator = getIndexifyValidator(entry);
			const target_path = path.join(outDir, entry.directory);
			indexify(target_path, getDirOptionDefaults(entry), validator);
		}
	};
}

/** Sets the default values for the dir options */
function getDirOptionDefaults(
	options: IndexifyDirectoryOptions
): IndexifyDefaultedDirectoryOptions {
	return {
		directory: options.directory,
		includeSubdirectories: options.includeSubdirectories
			? options.includeSubdirectories
			: false,
		indexFileName: options.indexFileName ? options.indexFileName : "index.json",
		recurse: options.recurse ? options.recurse : false,
		include: options.include,
		exclude: options.exclude,
	};
}

/** Creates the indexify entries and writes them to the indexing file. */
function indexify(
	valid_dir_path: string,
	options: IndexifyDefaultedDirectoryOptions,
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
					if (options.includeSubdirectories) {
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
	fs.writeFileSync(
		path.join(valid_dir_path, options.indexFileName),
		JSON.stringify(entries, undefined, 4)
	);
}

type TDirentValidator = (name: fs.Dirent) => boolean;

/** Gets a validator function for an entry in the directories array */
function getIndexifyValidator(directoryOptions: IndexifyDirectoryOptions) {
	let include = (name: string) => true;
	let exclude = (name: string) => false;
	if (typeof directoryOptions.include == "string") {
		const includeRE = new RegExp(directoryOptions.include);
		include = (name: string) => includeRE.test(name);
	}
	if (typeof directoryOptions.exclude == "string") {
		const excludeRE = new RegExp(directoryOptions.exclude);
		exclude = (name: string) => excludeRE.test(name);
	}
	return function (dirent: fs.Dirent) {
		return include(dirent.name) && !exclude(dirent.name);
	};
}
