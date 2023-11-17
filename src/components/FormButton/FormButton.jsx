import React from 'react';
import { Button } from 'react-bootstrap';

import './FormButton.css';


export default function FormButton({
    tableName = ''
    , inputFields = []
    , type = 'submit'
    , className = 'FormButton'
    , onClick = () => {}
    , children
}) {
    return (
        <Button
            type={type}
            className={className}
            onClick={onClick}
            onKeyDown={(e) => {
                if(e.key === 'Tab') {
                    e.preventDefault();
                    const firstInput = document.getElementById(`${tableName}-form-input-${inputFields[0]}`);
                    firstInput.focus();
                }
            }}
        >
            {children}
        </Button>
    )

}