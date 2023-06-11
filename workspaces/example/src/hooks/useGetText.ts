import { useEffect, useState } from "react";

/** Fetches text from a given path on the server */
export default function useGetText(path: string): string | undefined {
	const [available, setAvailable] = useState<string>();
	useEffect(() => {
		fetch(path, {
			method: "GET",
		})
			.then((r) => {
				return r.text();
			})
			.then((t) => {
				setAvailable(t);
			})
			.catch((e) => {
				console.error(
					"Problem fetching from server at",
					path,
					". Error was: ",
					e
				);
				setAvailable(`### Error getting ${path}\n\n ${e}`);
			});
	}, [path]);
	return available;
}
