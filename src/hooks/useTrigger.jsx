import { useState, useEffect } from "react";

/** Trigger the callback function when the trigger value changes,
 *  allowing for a result to be returned. Note:
 * * __null__ and __undefined__ will not trigger the callback.
 * 
 * @param {function} callback - The function to be executed when the trigger value changes.
 * @param {any} trigger - The value to be used as a trigger.
 */
export const useTrigger = (
    callback
    , trigger
) => {

    const [result, setResult] = useState(null);

    useEffect(() => {
        if (trigger === null || trigger === undefined) return;
        
        setResult(callback());
    }, [trigger]);

    return result;
} // capable of returning results