import React from 'react';
import { Button } from 'react-bootstrap';

import './FormButton.css';


export default function FormButton({
    children
    , type = 'submit'
    , disabled = false
    , outline = false
    , onClick = () => {}
}) {

    return (<>
        <Button
            disabled={disabled}
            type={type}
            className={outline ? 'FormButton-outline' : 'FormButton'}
            onClick={onClick}
            >
            {children}
        </Button>
    </>)

}