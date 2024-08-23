import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from "react";

/* 
 Two levels of cache,
 one for req memoization and other for data caching.
 Similar to react-query.
*/

type Callback = (...args: any[]) => Promise<any>;

export function cache<T extends Callback>(
   cb: T,
   keyParts: string[],
   options: { revalidate?: number | false; tags?: string[] } = {}
) {
   return nextCache(reactCache(cb), keyParts, options);
}
