/* Foreign dependencies */
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

/* Local dependencies */
import { useData } from "../core/dataContext";


export default function Select({
    tableName
    , value
    , customOptions = []
    , filters = {}
    , onChange = () => {}
}) {
    const dataContext = useData();

    const [options, setOptions] = useState([]);

    useEffect(() => {
        if(customOptions.length > 0) {
            setOptions(customOptions);
            return;
        }
    }, [customOptions]);

    useEffect(() => {
        retrieveData();
    }, []);

   
    async function retrieveData() {
        if(customOptions.length === 0) {
            const { response, json } = await dataContext.fetchData(tableName, filters, {}, false, false);

            if(response.status === 200) {
                const newOptions = [];
                json.map((row) => {
                    newOptions.push(row.name);
                })
                setOptions(newOptions);
            }
        }
    }

    const handleSelectChange = (e) => {
        onChange(e)
    }
    
    return (<>
        <Form.Group>
            <Form.Control 
                as="select"
                onChange={handleSelectChange}
                value={value}
            >
                <option key = 'blankChoice' hidden value>Select...</option>
                {options.map((option, index) => {
                    return (<option key={index} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>)
                })}
            </Form.Control>
        </Form.Group>
    </>)
}