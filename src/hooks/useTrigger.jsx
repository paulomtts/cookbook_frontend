/* Foreign Dependencies */  
import { useEffect, useState } from "react";


/**
 * Custom hook that provides rearmable trigger state.
 * @param {any} initialValue - The initial value of the trigger.
 * @returns {[any, function]} - An array containing the current value and a function to update it.
 */
export const useTrigger = (
    initialValue = null
) => {

    const [state, setState] = useState(initialValue);

    useEffect(() => {
        if (state === initialValue || state === null) return;
        setState(null);
    }, [state]);

    return [state, setState];
}