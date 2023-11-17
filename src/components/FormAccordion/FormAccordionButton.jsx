/* Foreign dependencies */
import React from "react";
import {  Button } from "react-bootstrap";
import { useAccordionButton } from "react-bootstrap";

import "./FormAccordion.css";


export default function FormAccordionButton({ children, eventKey }) {
    const handleClick = useAccordionButton(eventKey, () => {});

    return (
        <Button
            variant="outline-primary"
            className="FormAccordionButton"
            onClick={handleClick}
        >
            {children}
        </Button>
    );
}