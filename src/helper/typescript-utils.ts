import Validator from "./validator";

interface FoldProps<T, K> {
    value: T | null | undefined;
    ifPresent: (value: T) => K;
    ifAbsent?: () => K;
}

/**
 * Fold is a utility component that has two callbacks,
 * one that returns actual values if the given value is not null or undefined.
 * The other callback is called if the value is null or undefined.
 * @param value The value to fold
 * @param ifPresent The callback to call if the value is not null or undefined
 * @param ifAbsent The callback to call if the value is null or undefined
 * @returns The result inside the ```ifPresent``` callback
 * @example to use the fold as component 
 * <Fold value={null} ifPresent={v => <div>{v}</div>} ifAbsent={() => <div>Nothing</div>} />
 * @example to use the fold as a function
 * Fold(42, v => console.log(v), () => console.log("Nothing"))
 */
export const Fold = <T, K>({
    value,
    ifPresent,
    ifAbsent,
}: FoldProps<T, K>) => {
    if (!Validator.hasValue(value)) {
        if (ifAbsent) {
            return ifAbsent();
        }
        return null;
    }
    return ifPresent(value!);
};


/**
 * FoldRaw is a utility component that has two callbacks,
 * one that returns actual values if the given value is not null or undefined.
 * The other callback is called if the value is null or undefined.
 * @param value The value to fold
 * @param ifPresent The first callback to call if the value is not null or undefined
 * @param ifAbsent The second callback to call if the value is null or undefined
 * @returns The result inside the first ```ifPresent``` callback
 * @example to use the fold as a function
 * FoldRaw(42, v => console.log(v), () => console.log("Nothing"))
 */
export const FoldRaw = <T, K>(
    value: T | null | undefined,
    ifPresent: (value: T) => K,
    ifAbsent: () => K | undefined,
) => Fold({ value, ifPresent, ifAbsent });


/**
 * Search and return path from a URL
 * @param path The path to search
 * @param keys The keys to search
 * @returns The map of keys and values
 * @example
 * ExtractPath("/a/b/c/d", ["a", "b", "c", "d"]) // { a: "b", b: "c", c: "d" }
 * ExtractPath("/a/b/c/d", ["a", "b", "c"]) // { a: "b", b: "c" }
 * ExtractPath("/a/b/c/d", ["a", "b"]) // { a: "b" }
 * ExtractPath("/a/b/c/d", ["a"]) // { a: "b" }
 * ExtractPath("/a/b/c/d", ["b"]) // { b: "c" }
 * ExtractPath("/a/b/c/d", ["c"]) // { c: "d" }
 * ExtractPath("/a/b/c/d", ["d"]) // {}
 * ExtractPath("/a/b/c/d", ["e"]) // {}
 * ExtractPath("/a/b/c/d", ["a", "b", "c", "d", "e"]) // { a: "b", b: "c", c: "d" }
 * ExtractPath("/a/b/c/d", ["a", "b", "c", "d", "e", "f"]) // { a: "b", b: "c", c: "d" }
 */

export function ExtractPath(path: string, keys: string[]): { [key: string]: string | undefined } {
    try {
        const map: { [key: string]: string | undefined } = {};
        const parts = path.split('/');

        for (let i = 0; i < parts.length; i++) {
            if (keys.includes(parts[i])) {
                map[parts[i]] = parts[i + 1];
            }
        }

        return map;
    } catch (error) {
        return {};
    }
}

