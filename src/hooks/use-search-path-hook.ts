import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ExtractPath } from "../helper/typescript-utils";

/**
 * Hook to search for keys in the current path
 * @param keys The keys to search
 * @returns The map of keys and values
 * @example
 * const currentPath = useLocation().pathname;
 * useSearchPath(["a", "b", "c", "d"]) // { a: "b", b: "c", c: "d" }
 * useSearchPath(["a", "b", "c"]) // { a: "b", b: "c" }
 * useSearchPath(["a", "b","c"]) // { a: "b" }
 */
function useSearchPath(keys: string[]): { [key: string]: string | undefined } {

    const currentPath = useLocation().pathname;
    useEffect(() => {
        console.log("Current path: ", currentPath);
    }, [currentPath]);

    return ExtractPath(currentPath, keys);
}

export default useSearchPath;