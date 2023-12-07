/* Foreign dependencies */
import React from "react";
import { Accordion } from "react-bootstrap";

/* Local dependencies */
import FormAccordionButton from "./FormAccordionButton";
import FormButton from "../FormButton/FormButton";

export default function FormAccordion({
    tableName
    , dataLength
    , inputFields
    , children
    , onSubmit = () => {}
}) {
    return (<Accordion flush>
        <Accordion.Item className="FormAccordion-item" eventKey="0">

            <div className="FormAccordion-button-container">
                <FormAccordionButton eventKey="0">
                    Show
                </FormAccordionButton>

                <FormButton
                    tableName={tableName}
                    inputFields={inputFields}
                    onClick={onSubmit}
                >
                    Submit
                </FormButton>
            </div>

            <Accordion.Collapse eventKey="0" className="FormAccordion-collapse">
                {children}
            </Accordion.Collapse>
        </Accordion.Item>
    </Accordion>);

}