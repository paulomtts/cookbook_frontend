/* Foreign dependencies */
import React, { useState, useContext, createContext } from 'react';

/* Local dependencies */
import { useNotification } from './notificationContext';
import { useOverlay } from './overlayContext';


const apiAddresses = {
    local: {
        crud: {
            select: 'http://localhost:8000/crud/select',
            insert: 'http://localhost:8000/crud/insert',
            update: 'http://localhost:8000/crud/update',
            delete: 'http://localhost:8000/crud/delete',
            bulk_insert: 'http://localhost:8000/crud/insert/bulk',
        },
    }
    // add remote api here
};
const api = apiAddresses.local;

export const DataContext = createContext();

export function DataProvider({ children }) {
    const overlayContext = useOverlay();
    const notificationContext = useNotification();

    const [ingredientData, setIngredientData] = useState([]);
    const [recipeData, setRecipeData] = useState([]);
    const [unitData, setUnitData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [recipeIngredientData, setRecipeIngredientData] = useState([]);

    const getState = (objectName) => {
        switch (objectName) {
            case 'ingredient':
                return ingredientData;
            case 'recipe':
                return recipeData;
            case 'unit':
                return unitData;
            case 'category':
                return categoryData;
            case 'recipe_ingredient':
                return recipeIngredientData;
            default:
                return null;
        }
    };

    const _getStateSetter = (objectName) => {
        switch (objectName) {
            case 'ingredient':
                return setIngredientData;
            case 'recipe':
                return setRecipeData;
            case 'unit':
                return setUnitData;
            case 'category':
                return setCategoryData;
            case 'recipe_ingredient':
                return setRecipeIngredientData;
            default:
                return null;
        }    
    };

    function generatePayload({ method = 'GET', credentials = 'include', headers = {'Content-Type': 'application/json'}, body = null }) {
        return {
            method: method,
            credentials: credentials,
            headers: headers,
            body: body,
        }
    };

    const _makeRequest = async (payload, url, notification, overlay, overlayLength) => {

        if (overlay) await overlayContext.show();

        const response = await fetch(url, payload).catch(error => error);
        let json = { data: [] };
        let message = 'The resource was found but had no data stored.';

        if(response.status === 200) {
            json = await response.json();
            message = json.message;
        }

        if(notification) {
            notificationContext.spawnToast({
                title: response.status === 200 ? "Success" : "Error",
                message: message,
                variant: response.status === 200 ? "success" : "danger",
            });
        }

        if (overlay) await overlayContext.hide(overlayLength);

        return { response, json }
    }


    const fetchData = async (tableName, filters = {}, notification = true, overlay = true, overlayLength = 250) => {
        const url = api.crud.select + '?table_name=' + tableName;
        const payload = generatePayload({ method: 'POST', body: JSON.stringify({filters: filters}) });
        const { response, json } = await _makeRequest(payload, url, notification, overlay, overlayLength);

        if(response.status === 200 && json.data !== undefined){
            const stateSetter = _getStateSetter(tableName);
            const newData = JSON.parse(json.data);

            stateSetter(newData); 

            return { response, json }
        }
        
        return { response, json: { data: [] } }
    };

    const updateData = async (tableName, id, data, notification = true, overlay = true, overlayLength = 250) => {        
        const url = api.crud.update + '?table_name=' + tableName;
        const payload = generatePayload({ method: 'POST', body: JSON.stringify({...data, id: id}) }); 
        const response = await _makeRequest(payload, url, notification, overlay, overlayLength);
        
        return response
    };

    const deleteData = async (tableName, filters, notification = true, overlay = true, overlayLength = 250) => {
        const url = api.crud.delete + '?table_name=' + tableName;
        const payload = generatePayload({ method: 'POST', body: JSON.stringify({filters: filters}) });
        const response = await _makeRequest(payload, url, notification, overlay, overlayLength);

        return response
    }

    const submitData = async (tableName, data, bulk = false, notification = true, overlay = true, overlayLength = 250) => {
        const url = bulk ? 
            api.crud.bulk_insert + '?table_name=' + tableName
            : 
            api.crud.insert + '?table_name=' + tableName;

        const payload = generatePayload({ method: 'POST', body: JSON.stringify({...data}) });
        const response = await _makeRequest(payload, url, notification, overlay, overlayLength);

        return response
    }

    return (
        <DataContext.Provider value={{ getState, fetchData, updateData, deleteData, submitData, generatePayload }}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => {
    return useContext(DataContext);
};