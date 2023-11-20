/* Foreign dependencies */
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

/* Local dependencies */
import { useData } from "../core/dataContext";


export default function Select({
    tableName
    , disabled
    , value
    , customOptions = []
    , filters = {}
    , onChange = () => {}
    , style
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
                className="Select"
                as="select"
                onChange={handleSelectChange}
                value={value}
                disabled={disabled}
                style={{...style, border: (disabled ? 'none': '1px solid lightgray'), cursor: (disabled ? 'auto' : 'pointer')}}
            >
                <option key = 'blankChoice' hidden value>Select...</option>
                {options.map((option, index) => {
                    return (<option key={index} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>)
                })}
            </Form.Control>
        </Form.Group>
    </>)
}