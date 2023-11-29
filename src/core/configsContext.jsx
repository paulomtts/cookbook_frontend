/* Foreign dependencies */
import React, { useRef, useContext, createContext, useEffect } from 'react';

/* Local dependencies */
import { useData, api } from './dataContext';

const ConfigsContext = createContext();

export function ConfigsProvider({ children }) {

    const dataContext = useData();
    const maps = useRef({});

    useEffect(() => {
        const retrieveMaps = async () => {
            const mapsPayload = dataContext.generatePayload('GET');
            await dataContext.customRoute(api.crud.maps, mapsPayload, false).then(({response, content}) => {
                if (response.status === 200) {
                    maps.current = content;
                } else {
                    // navigate back to entry page
                }
            });
        }
        
        retrieveMaps();
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