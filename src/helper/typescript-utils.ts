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
    if (!value || value == null) {
        return ifAbsent?.() ?? null;
    }
    return ifPresent(value);
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

