/* Foreign dependencies */
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

/* Local dependencies */
import { useData } from "../core/dataContext";


export default function Select({
    tableName
    , filters = {}
    , customOptions = []
    , targetField = 'id'
    , value
    , required
    , disabled
    , className = ''
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
            if (dataContext.getState(tableName).length > 0){
                setOptions(dataContext.getState(tableName));
                return;
            }

            const { response, json } = await dataContext.fetchData(tableName, filters, {}, false, false);

            if(response.status === 200) {
                setOptions(json);
            }
        }
    }

    const handleSelectChange = (e) => {
        onChange(e);
    }
    
    return (<>
        <Form.Group>
            <Form.Control 
                className={`Select ${className}`}
                as="select"
                onChange={handleSelectChange}
                value={value}
                disabled={disabled}
                required={required}
                style={{border: (disabled ? 'none': '1px solid lightgray'), cursor: (disabled ? 'auto' : 'pointer')}}
            >
                <option key='blankChoice' value={null} hidden>Select...</option>
                {options.map((option, index) => {
                    const exhibitedOption = customOptions.length > 0 ? option : option.name;

                    return (<option key={index} value={customOptions.length > 0 ? exhibitedOption : option[targetField]}>{exhibitedOption.charAt(0).toUpperCase() + exhibitedOption.slice(1)}</option>)
                })}
            </Form.Control>
        </Form.Group>
    </>)
}