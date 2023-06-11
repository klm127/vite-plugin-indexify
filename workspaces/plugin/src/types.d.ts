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
export interface IndexifyOptions {
	/** The directories in assets to indexify.  */
	publicSubdirs: IndexifyDirectoryOptions[];
}

export interface IndexifyDirectoryOptions {
	/** The directory, relative to 'public', to indexify. */
	directory: string;
	/** The output file name. Defaults to 'index.json' */
	indexFileName?: string;
	/** Only filenames matching this pattern will be indexified. Defaults to all. */
	include?: RegExp;
	/** Filenames matching this pattern will not be indexified. Defaults to none. */
	exclude?: RegExp;
	/** Whether to recurse into and indexify subdirectories. They will have the same indexFileName. */
	recurse?: boolean;
	/* Whether to put an entry in the index for subdirectories or not. */
	includeSubdirectories?: boolean;
}

export interface IndexifyDefaultedDirectoryOptions {
	/** The directory, relative to 'public', to indexify. */
	directory: string;
	/** The output file name. Defaults to 'index.json' */
	indexFileName: string;
	/** Only filenames matching this pattern will be indexified. Defaults to all. */
	include?: RegExp;
	/** Filenames matching this pattern will not be indexified. Defaults to none. */
	exclude?: RegExp;
	/** Whether to recurse into and indexify subdirectories. They will have the same indexFileName. */
	recurse: boolean;
	/* Whether to put an entry in the index for subdirectories or not. */
	includeSubdirectories: boolean;
}

export interface IndexifyOutput {
	/** The name of the entry */
	name: string;
	/** Whether this entry represents a directory */
	isDirectory: boolean;
	/** If the entry is a directory, and 'recurseFlat' was not true, it will contain further indexifyOutput entries for all files in that directory. If 'recurse' was false, it will be empty.  */
	dirContents?: IndexifyOutput[];
}
