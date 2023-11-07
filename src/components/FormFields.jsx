/* Foreign dependencies */
import React from "react";
import { Form, Row, Col } from "react-bootstrap";


export default function FormFields({
    tableName
    , formData
    , inputFields = []
    , customInputs = {}
    , avoidColumns = []
    , onInputChange = () => {}
}) {
    return (

        <div className="generic-form-inputs">
            {Object.keys(formData).length > 0 && inputFields.map((key, index) => {
                if(avoidColumns.includes(key)) return null;

                return (
                <Row key={index}>
                    <Col style={{marginBottom: '15px'}}>
                        <Form.Group>
                            <Form.Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Form.Label>
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
                                    id={`${tableName}-generic-form-input-${key}`}
                                    type="text" 
                                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)} 
                                    value={formData[key]} 
                                    onChange={(e) => onInputChange(e, key)} 
                                />
                            }
                        </Form.Group>
                    </Col>
                </Row>
                )
            })}
        </div>
    )
}