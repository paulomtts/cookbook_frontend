/* Foreign dependencies */
import { useState, useEffect } from "react";

/* Local dependencies */
import { useData } from "../core/dataContext";


/**
 * Fetches data from the server and stores it in the state.
 * @param {string} name - The name of the query to be executed.
 */
export function useDataFetcher(name, filters = {}) {
    const dataContext = useData();

    const [data, setData] = useState([]);
    
    const fetchData = async () => {
        const { json } = await dataContext.fetchData(name, filters, {}, false);
        setData(json);
    }

    useEffect(() => {
        fetchData();
    }, [name]);

    return [data, setData];
}