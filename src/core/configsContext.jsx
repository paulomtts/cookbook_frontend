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
            const response = await fetch(api.custom.maps);
            const content = await response.json();
            const newMaps = JSON.parse(content.data);
            setMaps(newMaps);
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