import { useEffect, useState } from "react";

interface ILocalStorage<T> {
    value: any;
    setValue: (value: any) => void;
    removeValue: () => void;
}

const useLocalStorage = <T>(
    key: string,
    initialValue?: T,
): ILocalStorage<T> => {
    const [value, setStoredValue] = useState<T | undefined>(initialValue);

    useEffect(() => {
        // Retrieve from localStorage
        const item = localStorage.getItem(key);
        if (item && item != null) {
            if (typeof value === 'object') {

                setStoredValue(JSON.parse(item));
            } else {
                setStoredValue(item as T);
            }
        }
    }, [key]);

    const setValue = (value: any) => {
        // Save state
        setStoredValue(value);
        if (typeof value === 'object') {
            // Save to localStorage
            localStorage.setItem(key, JSON.stringify(value));
        } else {
            localStorage.setItem(key, value);
        }

    };

    const removeValue = () => {
        localStorage.removeItem(key);
    }


    return { value, setValue, removeValue };
};

export default useLocalStorage;