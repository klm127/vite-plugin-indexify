import { useEffect, useState } from "react";

/** Fetches index.json information from a given path on the server */
export default function useIndexFilesOnly(path: string): string[] {
	const [available, setAvailable] = useState<string[]>([]);
	useEffect(() => {
		fetch(path, {
			method: "GET",
		})
			.then((r) => {
				return r.json();
			})
			.then((j) => {
				if (!Array.isArray(j)) {
					console.error(
						"Server response at",
						path,
						"was not a JSON array as expected. Got: ",
						j
					);
				} else {
					const arr = [];
					for (let item of j) {
						if (item.name === undefined) {
							console.error(item, " retrieved from server has no field name!");
						} else {
							if (item.isDirectory !== undefined && item.isDirectory !== true) {
								arr.push(item.name);
							}
						}
					}
					setAvailable(arr);
				}
			})
			.catch((e) => {
				console.error(
					"Problem fetching from server at",
					path,
					". Error was: ",
					e
				);
			});
	}, [path]);
	return available;
}
