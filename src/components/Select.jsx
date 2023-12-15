/* Foreign dependencies */
import React from "react";
import { Form } from "react-bootstrap";


export default function Select({
    data = []
    , showField = 'name'
    , targetField = 'id'
    , value // value is the id of the selected option, keep this name for compatibility with ComboBox
    , required
    , disabled
    , className = ''
    , onChange = () => {}
}) {
 
    const handleSelectChange = (e) => {
        const row = data.filter((row) => {
            
            return row[targetField] == e.target.value;
        })[0];
        onChange(row[targetField]);
    }

    return (<>
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
            {data.map((option, index) => {
                const exhibitedOption = option[showField];

                return (<option key={index} value={option[targetField]}>{exhibitedOption.charAt(0).toUpperCase() + exhibitedOption.slice(1)}</option>)
            })}
        </Form.Control>
    </>)
}