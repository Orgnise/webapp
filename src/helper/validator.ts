
export default class Validator {

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
    static hasValue(obj: any): boolean {
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

}

