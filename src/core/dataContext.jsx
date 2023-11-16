/* Foreign dependencies */
import React, { useState, useContext, createContext } from 'react';

/* Local dependencies */
import { useNotification } from './notificationContext';
import { useOverlay } from './overlayContext';


const addresses = {
    local: {
        crud: {
            select: 'http://localhost:8000/crud/select',
            insert: 'http://localhost:8000/crud/insert',
            update: 'http://localhost:8000/crud/update',
            delete: 'http://localhost:8000/crud/delete',
            insert_bulk: 'http://localhost:8000/crud/insert_bulk',
        },
    }
    // add remote api here
};
const api = addresses.local;


const DataContext = createContext();
const { Provider } = DataContext;

export function DataProvider({ children }) {
    const overlayContext = useOverlay();
    const notificationContext = useNotification();

    const [ingredientData, setIngredientData] = useState([]);
    const [recipeData, setRecipeData] = useState([]);
    const [unitData, setUnitData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);

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
            default:
                return null;
        }    
    };

    /**
     * Generates a payload object with the given parameters.
     * @param {Object} options - The options object.
     * @param {string} options.method - The HTTP method to use. Defaults to 'GET'.
     * @param {string} options.credentials - The credentials mode to use. Defaults to 'include'.
     * @param {Object} options.headers - The headers to include in the request. Defaults to {'Content-Type': 'application/json'}.
     * @param {Object} options.body - The body of the request. Defaults to null.
     * @returns {Object} - The generated payload object.
     */
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
        let content = { data: [] };
        let message = 'The resource was found but had no data stored.';

        if(response.status === 200) {
            content = await response.json();
            message = content.message;
        }

        if(notification) {
            notificationContext.spawnToast({
                title: response.status === 200 ? "Success" : "Error",
                message: message,
                variant: response.status === 200 ? "success" : "danger",
            });
        }

        if (overlay) await overlayContext.hide(overlayLength);

        return { response, content }
    }


    /**
     * Fetches data from the API for a given table and filters.
     * @param {string} tableName - The name of the table to fetch data from.
     * @param {Object} filters - The filters to apply to the data.
     * @param {boolean} notification - Whether to show a notification during the fetch.
     * @param {boolean} overlay - Whether to show an overlay during the fetch.
     * @param {number} overlayLength - The length of time to show the overlay for.
     * @returns {Promise<{response: Response, json: {data: []}}>} The response and JSON data from the API.
     */
    const fetchData = async (tableName, filters = {}, lambdaArgs = {}, notification = true, overlay = true, overlayLength = 250, structured = false) => {
        const url = api.crud.select + '?table_name=' + tableName + '&structured=' + structured;
        const payload = generatePayload({ method: 'POST', body: JSON.stringify({filters: filters, lambda_args: lambdaArgs}) });
        const { response, content } = await _makeRequest(payload, url, notification, overlay, overlayLength);

        if(response.status === 200 && content.data !== undefined){
            const stateSetter = _getStateSetter(tableName);
            const json = await JSON.parse(content.data);
            if(stateSetter !== null) stateSetter(json); 

            return { response, json }
        }
        
        return { response, json: [] }
    };

    /**
     * Updates data in a table.
     * @param {string} tableName - The name of the table to update data in.
     * @param {number} id - The id of the data to update.
     * @param {object} data - The updated data to be saved.
     * @param {boolean} [notification=true] - Whether to show a notification after the update is complete. Default is true.
     * @param {boolean} [overlay=true] - Whether to show an overlay while the update is in progress. Default is true.
     * @param {number} [overlayLength=250] - The length of time to show the overlay in milliseconds. Default is 250.
     * @returns {Promise<object>} - The response from the server.
     */
    const updateData = async (tableName, id, data, notification = true, overlay = true, overlayLength = 250) => {        
        const url = api.crud.update + '?table_name=' + tableName;
        const payload = generatePayload({ method: 'POST', body: JSON.stringify({...data, id: id}) }); 
        const response = await _makeRequest(payload, url, notification, overlay, overlayLength);
        
        return response
    };

    /**
     * Deletes data from a table based on the provided filters.
     * @param {string} tableName - The name of the table to delete data from.
     * @param {Object} filters - The filters to apply when deleting data.
     * @param {boolean} [notification=true] - Whether or not to show a notification after the deletion is complete. Defaults to true.
     * @param {boolean} [overlay=true] - Whether or not to show an overlay while the deletion is in progress. Defaults to true.
     * @param {number} [overlayLength=250] - The length of time to show the overlay, in milliseconds. Defaults to 250.
     * @returns {Promise<Object>} - A Promise that resolves with the response from the server.
     */
    const deleteData = async (tableName, filters, notification = true, overlay = true, overlayLength = 250) => {
        const url = api.crud.delete + '?table_name=' + tableName;
        const payload = generatePayload({ method: 'POST', body: JSON.stringify({filters: filters}) });
        const response = await _makeRequest(payload, url, notification, overlay, overlayLength);

        return response
    }

    /**
     * Submits data to the backend API.
     * @param {string} tableName - The name of the table to insert data into.
     * @param {Object} data - The data to be inserted.
     * @param {boolean} [bulk=false] - Whether to insert data in bulk.
     * @param {boolean} [notification=true] - Whether to show a notification after the request is completed.
     * @param {boolean} [overlay=true] - Whether to show an overlay while the request is being processed.
     * @param {number} [overlayLength=250] - The length of time (in milliseconds) to show the overlay.
     * @returns {Promise<Object>} - The response from the API.
     */
    const submitData = async (tableName, data, bulk = false, notification = true, overlay = true, overlayLength = 250) => {
        const url = bulk ? 
            api.crud.insert_bulk + '?table_name=' + tableName
            : 
            api.crud.insert + '?table_name=' + tableName;

        const payload = generatePayload({ method: 'POST', body: JSON.stringify({...data}) });
        const response = await _makeRequest(payload, url, notification, overlay, overlayLength);

        return response
    }

    
    return (
        <Provider value={{ getState, fetchData, updateData, deleteData, submitData, generatePayload }}>
            {children}
        </Provider>
    );
}

export const useData = () => {
    return useContext(DataContext);
};