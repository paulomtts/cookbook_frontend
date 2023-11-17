/* Foreign dependencies */
import React from "react";
import { Form } from "react-bootstrap";

import "./FormFields.css";

export default function FormFields({
    tableName
    , fields = []
    , avoid = []
    , formData
    , customInputs = {}
    , onInputChange = () => {}
}) {

    return (<div className="FormFields-container">
        {Object.keys(formData).length > 0 && fields.map((key, index) => {
            if(avoid.includes(key)) return null;

            return (<Form.Group key={index}>

                    <Form.Label>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Form.Label>

                    {customInputs[key] ? 
                        React.cloneElement(
                            customInputs[key]
                            , { 
                                value: formData[key]
                                , onChange: (e) => {
                                    onInputChange(e, key)
                                }
                            }
                        )
                        :
                        <Form.Control 
                            id={`${tableName}-form-input-${key}`}
                            type="text" 
                            placeholder={key.charAt(0).toUpperCase() + key.slice(1)} 
                            value={formData[key]} 
                            onChange={(e) => onInputChange(e, key)} 
                        />
                    }

            </Form.Group>)
        })}
    </div>)
}