/* Foreign Dependencies */  
import { useState } from "react";

/* Local dependencies */    
import { useRearm } from "./useRearm";


/**
 * Custom hook that returns a stateful value and a function to update it. The trigger is
 * automatically re-armed (set to null) right after each update (using the useRearm hook). This hook is syntax
 * sugar for the useState and useRearm hooks.
 * @param {*} initialValue - The initial value of the state.
 * @returns {[*, Function]} An array with the current state value and a function to update it.
 */
export const useTrigger = (
    initialValue = null
) => {

    const [state, setState] = useState(initialValue);
    useRearm(setState, state); // re-arm mechanism

    return [state, setState];
}