/* Foreign dependencies */
import React from "react";
import { Form } from "react-bootstrap";

import "./FormFields.css";

export default function FormFields({
    tableName
    , fields = []
    , formData = {}
    , customInputs = {}
    , readOnly = false
    , onInputChange = () => {}
}) {

return (<div className="FormFields-container">
        {fields.map((key, index) => {
            return (<Form.Group key={index}>

                    <Form.Label>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Form.Label>

                    {customInputs[key] ? 
                        React.cloneElement(customInputs[key], { 
                            value: formData[key]
                            , onChange: (e, someKey, row) => {
                                if(e.target) {
                                    onInputChange(e.target.value, key)
                                } else {
                                    onInputChange(e, key)
                                }
                            }}
                        )
                        :
                        <Form.Control 
                            id={`${tableName}-form-input-${key}`}
                            type="text" 
                            value={formData[key]} 
                            disabled={readOnly}
                            onChange={(e) => onInputChange(e.target.value, key)} 
                        />
                    }

            </Form.Group>)
        })}
    </div>)
}