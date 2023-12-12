/* Foreign dependencies */
import React, { useState, useContext, createContext, useEffect } from 'react';

/* Local dependencies */
import { api } from './dataContext';

const ConfigsContext = createContext();
const { Provider } = ConfigsContext;

export function ConfigsProvider({ children }) {

    const [maps, setMaps] = useState({});
    const [user, setUser] = useState({});

    useEffect(() => {
        const retrieveMaps = async () => {
            await fetch(api.custom.maps).then(async (response) => {
                if (response.ok){
                    const content = await response.json();
                    const newMaps = JSON.parse(content.data);
                    setMaps(newMaps);
                }
            }).catch(error => {
                console.log(error);
            });
        }

        const retrieveUser = async () => {
            await fetch(api.custom.user, {
                method: 'GET',
                credentials: 'include'
            }).then(async (response) => {
                if (response.ok){
                    const content = await response.json();
                    const newUser = JSON.parse(content.data);
                    setUser(newUser);
                }
            }).catch(error => {
                console.log(error);
            });
        }
        
        retrieveMaps();
        retrieveUser();
    }, []);


    return (
        <Provider value={{maps, user}}>
            {children}
        </Provider>
    );
}

export const useConfigs = () => {
    return useContext(ConfigsContext);
};