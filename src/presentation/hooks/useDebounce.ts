import { useEffect, useRef } from 'react';

/**
 * Custom hook to debounce a callback function
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced version of the callback
 */
function useDebounce<T extends (search: string) => void>(callback: T, delay: number): T {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const debouncedCallback = (search: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            callback(search);
        }, delay);
    };

    return debouncedCallback as T;
}

export default useDebounce;
