import { useState } from 'react';

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