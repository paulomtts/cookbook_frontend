/* Foreign dependencies */
import React from "react";
import {  Button } from "react-bootstrap";
import { useAccordionButton } from "react-bootstrap";


export default function FormAccordionButton({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () => {});

    return (
        <Button
            variant="outline-primary"
            className="custom-accordion-button"
            onClick={decoratedOnClick}
        >
            {children}
        </Button>
    );
}