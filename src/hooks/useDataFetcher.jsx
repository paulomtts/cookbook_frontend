/* Foreign dependencies */
import { useState, useEffect } from "react";

/* Local dependencies */
import { useData } from "../core/dataContext";


/**
 * Fetches data from the server and stores it in the state.
 * @param {string} name - The name of the query to be executed.
 * @param {object} filters - The filters to be applied to the query.
 * @param {array} triggers - The triggers to be used to fetch data. Meant to be used with useTrigger().
 */
export function useDataFetcher(name, filters = {}, triggers = []) {
    const dataContext = useData();

    const [data, setData] = useState([]);
    
    const fetchData = async () => {
        const { json } = await dataContext.fetchData(name, filters, {}, false);
        setData(json);
    }

    useEffect(() => {
        if (triggers.length > 0 && triggers.every(trigger => trigger === null)) return;
        fetchData();
    }, [name, ...triggers]);

    return [data, setData];
}