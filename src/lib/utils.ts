import slugify from "@sindresorhus/slugify";
import { clsx, type ClassValue } from "clsx";
import { nanoid } from "nanoid";
import { NextRequest } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
  if (!obj || obj === null || obj === undefined) {
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

export async function generateSlug({
  title,
  didExist = async () => false,
  suffixLength,
}: {
  title: string;
  didExist?: (val: string) => Promise<boolean>;
  suffixLength?: number;
}) {
  if (!hasValue(title)) {
    title = randomId();
    return title;
  }
  const normalizedName = slugify(title, { separator: "-" });
  let slug = normalizedName;
  if (suffixLength) {
    slug = `${slug}-${randomId(suffixLength)}`;
  }
  let exists = await didExist(slug);
  if (exists) {
    while (exists) {
      slug = `${slug}-${randomId(6)}`;
      exists = await didExist(slug);
    }
  } else if (slug.length > 50) {
    slug = slug.slice(0, 32);
  } else if (slug.length <= 3) {
    slug = `${slug}-${randomId(4)}`;
  }
  return slug;
}

/**
 * Generate a uuid v4.
 * @example
 * const id = randomId();
 * console.log(id); // 110ec58a-a0f2-4ac4-8393-c866d813b8d1
 * @returns {string} A random id
 */
export function randomId(length: number = 21): string {
  return nanoid(length);
  // let dt = new Date().getTime();
  // let format = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  // if (length === 4) {
  //   format = "xxxx";
  // } else if (length === 6) {
  //   format = "xxxxxx";
  // } else if (length === 16) {
  //   format = "xxxx-xxxx-xxxx-xxxx";
  // } else if (length === 36) {
  //   format = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  // }
  // const uuid = format.replace(/[xy]/g, (c: string) => {
  //   const r = (dt + Math.random() * 16) % 16 | 0;
  //   dt = Math.floor(dt / 16);
  //   return (c === "x" ? r : (r && 0x3) || 0x8).toString(16);
  // });
  // return uuid;
}

/**
 * Pluralize a word.
 * @param word The word to pluralize
 * @param count The count to check if the word should be pluralized
 * @returns The pluralized word
 */
export function pluralize(word: string, count: number): string {
  return count === 1 ? word : `${word}s`;
}

export const parse = (req: NextRequest) => {
  // path is the path of the URL (e.g. orgnise.in/home/settings -> /home/settings)
  let path = req.nextUrl.pathname;

  // fullPath is the full URL path (along with search params)
  const searchParams = req.nextUrl.searchParams.toString();
  const fullPath = `${path}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  return { path, fullPath };
};
