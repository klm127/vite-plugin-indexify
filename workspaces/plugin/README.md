# vite-plugin-indexify

Indexify is a plugin for vite that is used to generate index.json files amongst your output.

These files list all or some files in the output directory or subdirectories as entries in a json array.

This is useful for telling your front end what paths are available to fetch from.

## Why

I wanted to create a simple static site generator and use some react components with remark. The components would ping the API for markdown data, then render it to the DOM. Using GitHub pages, I had no way to tell my front end what markdown files were available for it to ask for. Indexify solves that problem by giving me a single point where I can ask for information about what is available. Basically, it gives your front end a menu of options.

Indexify can help your front end find out
- What text files are in some directory on the server
- What image files are in some directory on the server
- What subdirectories are in some directory on the server
- What `<insert file type>` files are in some directory on the server

It works by waiting until vite/rollup output is finished, then reading the directory using fs. 

**Note** I have not yet worked out how to generate the indexify bundles for the Vite live-reloading server. It will work for builds and previews, but not the live reload. I've been investigating, I need middleware function(s), but I haven't worked out how to do it. Open for PRs if anyone would like to assist.

## Future Features

1. Get it working on Vite dev server
2. I'd like to be able to add additional information to the json entries, such as YAML front matter extracted from each file. You should be able to pass indexify a function that can take the file data as a parameter and generate additional fields for inclusion in the index entries.

## Usage

Check out the example workspace for some usage.

The plugin takes an array as a parameter. If nothing is passed, by default, it will produce a file named 'index.json' for every subfolder in your output. 

Each item in the array is an option for one or more index.jsons to be produced.

```js
export default defineConfig({
	plugins: [
		indexify([
            {
                directory: "posts",
                recurse: true,
            },
        ]),
	],
    //...
```

The full option is as follows:

```ts
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
```








