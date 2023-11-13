import { useState, useEffect } from "react";

/** Execute the callback function when the trigger value changes, and
 * stores a result to be returned. After that, the trigger value is reset to null.
 * 
 * * __null__ and __undefined__ will not trigger the callback.
 * @param {function} callback - The function to be executed when the value changes.
 * @param {any} value - The value to be used as a trigger.
 */
export const useRearm = (
    callback
    , value
) => {

    const [result, setResult] = useState(null);

    useEffect(() => {
        if (value === null || value === undefined) return;
        
        setResult(callback(null));
    }, [value]);

    return result;
} // capable of returning results