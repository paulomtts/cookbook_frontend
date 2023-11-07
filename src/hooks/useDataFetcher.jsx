/* Foreign dependencies */
import { useState, useEffect } from "react";

/* Local dependencies */
import { useData } from "../core/dataContext";


/**
 * Fetches data from the server and stores it in the state.
 * @param {string} name - The name of the query to be executed.
 */
export function useDataFetcher(name) {
    const dataContext = useData();

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const { json } = await dataContext.fetchData(name, {}, false);
            const newData = await JSON.parse(json.data);
            setData(newData);
        }

        fetchData();
    }, [name]);

    return [data, setData];
}