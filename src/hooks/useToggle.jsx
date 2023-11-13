import { useState } from 'react';


/**
 * Toggles a state between two values. If a list of values is provided, the 
 * state will be toggled between the values in the list. Please note that only 
 * a list of two values is supported. 
 * @param {string} initialStatus - The initial value of the state. (default: false)
 * @param {Array} valueList - The list of values to toggle between. (default: [] - toggle between true and false)
 */
export const useToggle = (
    initialStatus = false
    , valueList = []
) => {
    const [status, setStatus] = useState(initialStatus);
    
    const toggleStatus = () => {
        if(valueList.length === 0){
            setStatus(prevState => !prevState);
        } else {
            setStatus(prevState => {
                const index = valueList.indexOf(prevState);
                if(index === -1){
                    return valueList[0];
                } else {
                    return valueList[(index + 1) % valueList.length];
                }
            });
        }
    }

    return { status, toggleStatus, setStatus };
}