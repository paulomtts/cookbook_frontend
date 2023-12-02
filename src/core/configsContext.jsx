/* Foreign dependencies */
import React, { useState, useContext, createContext, useEffect } from 'react';

/* Local dependencies */
import { useData, api } from './dataContext';

const ConfigsContext = createContext();
const { Provider } = ConfigsContext;

export function ConfigsProvider({ children }) {

    const dataContext = useData();
    const [maps, setMaps] = useState({});

    useEffect(() => {
        const retrieveMaps = async () => {
            const mapsPayload = dataContext.generatePayload('GET');
            await dataContext.customRoute(api.custom.maps, mapsPayload, false).then(({response, content}) => {
                const json = JSON.parse(content.data);  
                if (response.status === 200) {
                    setMaps(json);
                } else {
                    // navigate back to entry page
                }
            });
        }
        
        retrieveMaps();
    }, []);


    return (
        <Provider value={{maps}}>
            {children}
        </Provider>
    );
}

export const useConfigs = () => {
    return useContext(ConfigsContext);
};