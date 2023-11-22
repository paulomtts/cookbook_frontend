/* Foreign dependencies */
import React, { useRef, useContext, createContext, useEffect } from 'react';

/* Local dependencies */
import { useData, api } from './dataContext';

const ConfigsContext = createContext();

export function ConfigsProvider({ children }) {

    const dataContext = useData();
    const maps = useRef({});

    useEffect(() => {
        const mapsPayload = dataContext.generatePayload('GET');
        dataContext.customRoute(api.crud.maps, mapsPayload, false).then((response) => {
            if (response.response.status === 200) {
                maps.current = response.content;
            } else {
                // navigate back to entry page
            }
        });
    }, []);


    return (
        <ConfigsContext.Provider value={{maps}}>
            {children}
        </ConfigsContext.Provider>
    );
}

export const useConfigs = () => {
    return useContext(ConfigsContext);
};