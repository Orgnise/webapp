import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


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
export const Fold = <T, K>({ value, ifPresent, ifAbsent }: FoldProps<T, K>) => {
  if (!hasValue(value)) {
    if (ifAbsent) {
      return ifAbsent();
    }
    return null;
  }
  return ifPresent(value!);
};

/**
   * Checks if the given object is not null, not undefined and not empty.
   * @param obj The object to check.
   * @returns True if the object is not null or undefined and not empty, false otherwise.
   * @memberof Validator
   * @example
   * Validator.hasValue(null); // false
   * Validator.hasValue(undefined); // false
   * Validator.hasValue({}); // false
   * Validator.hasValue({ a: 1 }); // true
   * Validator.hasValue([]); // false
   * Validator.hasValue([1]); // true
   * Validator.hasValue(''); // false
   * Validator.hasValue('a'); // true
   * Validator.hasValue(0); // true
   * Validator.hasValue(false); // true
   * Validator.hasValue(true); // true
   * Validator.hasValue(NaN); // true
   * Validator.hasValue(Infinity); // true
   * Validator.hasValue(-Infinity); // true
   */
export function hasValue(obj: any): boolean {
  if (obj === null || obj === undefined) {
    return false;
  }
  if (typeof obj === "object") {
    if (Array.isArray(obj)) {
      return obj.length > 0;
    } else {
      return Object.keys(obj).length > 0;
    }
  }
  if (typeof obj === "string") {
    return obj.length > 0;
  }
  return true;
}

export type PrettiFy<T> = {
  [P in keyof T]: T[P] extends string
  ? string
  : T[P] extends number
  ? number
  : T[P] extends boolean
  ? boolean
  : T[P] extends object
  ? PrettiFy<T[P]>
  : T[P] extends Array<infer P>
  ? Array<PrettiFy<P>>
  : T[P];
} & {};