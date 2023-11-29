/*Foreign dependencies*/
import React, { createContext, useContext } from "react";

const FormContext = createContext();
const { Provider } = FormContext;

export function FormProvider({ children }) {

    /**
     * Checks if an object is included in an array of objects.
     * 
     * NOTE: this does not compare the objects references themselves, but rather their string representations.
     *
     * @param {Object} data - The data to search in.
     * @param {Object} target - The target object to search for.
     * @returns {boolean} - True if the target object is included in the data, false otherwise.
     */
    const includesTarget = (data, target) => {
        return JSON.stringify(data).includes(JSON.stringify(target));
    }

    /**
     * Checks if an object with a specific field value exists in an array of objects.
     * 
     * NOTE: this does not compare the objects references themselves, but the values of a specific field.
     * @param {Array} data - The array of objects to search.
     * @param {Object} target - The object to search for.
     * @param {string} fieldName - The name of the field to compare.
     * @returns {boolean} - True if an object with the same field value exists, false otherwise.
     */
    const includesTargetByField = (data, target, fieldName) => {
        const result = data.filter(row => row[fieldName] === target[fieldName]);

        if (result.length === 0) {
            return false;
        }

        return true;
    }


    /* Consolidation */
    /**
     * Consolidates values from a dictionary into an array of objects based on a specified field name.
     * @param {Array} data - The array of objects to consolidate values into.
     * @param {Object} valueDict - The dictionary containing the values to consolidate.
     * @param {string} pkName - The field name to match between the data array and the value dictionary.
     * @param {string} toFieldName - The field name to add the consolidated value to in the data array.
     * @returns {Array} - The consolidated array of objects.
     */
    const consolidateData = (data, valueDict, pkName, toFieldName) => {
        const consolidatedData = data.map(row => {
            const newRow = { ...row };
            const value = valueDict[row[pkName]];

            if (value) {
                newRow[toFieldName] = value;
            }

            return newRow;

        });

        return consolidatedData;
    }

    /**
     * Consolidates data into insert, update, and delete rows based on a snapshot and primary key.
     *
     * @param {Array} snapshotData - The snapshot data to compare against.
     * @param {Array} consolidatedData - The data to consolidate.
     * @param {string} pkName - The name of the primary key field.
     * @returns {Object} - An object containing arrays of insert, update, and delete rows.
     */
    const consolidateOperations = (snapshotData, consolidatedData, pkName) => {
        const insertRows = [];
        const updateRows = [];

        consolidatedData.forEach(row => {
            if (!includesTargetByField(snapshotData, row, pkName)) {
                insertRows.push(row);
            }

            if (includesTargetByField(snapshotData, row, pkName) && !includesTarget(snapshotData, row)) {
                updateRows.push(row);
            }
        });

        const deleteRows = snapshotData.filter(row => !includesTargetByField(consolidatedData, row, pkName));

        return {
            insertRows
            , updateRows
            , deleteRows
        }
    }


    /**
     * Removes specified columns from the data object.
     * 
     * @param {Array<Object>} data - The data object containing rows and columns.
     * @param {Array<string>} avoid - The columns to be avoided and removed.
     * @returns {Array<Object>} - The new data object with removed columns.
     */
    const removeColumns = (data, avoid) => {
        const newData = data.map(row => {
            const newRow = { ...row };

            Object.keys(row).forEach(key => {
                if (avoid.includes(key)) {
                    delete newRow[key];
                }
            });

            return newRow;
        });

        return newData;   
    }
        

    return (
        <Provider value={{consolidateData, consolidateOperations, removeColumns}}>
            {children}
        </Provider>
    )
}

export const useForm = () => {
    return useContext(FormContext);
};