/* Foreign dependencies */
import React from "react";
import { Row, Col, Button, Accordion } from "react-bootstrap";

/* Local dependencies */
import FormAccordionButton from "./FormAccordionButton";

export default function FormAccordion({
    tableName
    , dataLength
    , inputFields
    , children
    , onSubmit = () => {}
}) {
    return (
        <Accordion flush>
            <Accordion.Item eventKey="0" style={{backgroundColor: 'transparent'}}>
                <Row style={{margin: '0px', paddingBottom: '10px'}}>
                    <Col>
                        {dataLength > 0 && <FormAccordionButton eventKey="0">Show</FormAccordionButton>}
                    </Col>

                    <Col>
                        <Button
                            type="submit"
                            className="generic-form-submit"
                            onClick={onSubmit}
                            onKeyDown={(e) => {
                                if(e.key === 'Tab') {
                                    e.preventDefault();
                                    const firstInput = document.getElementById(`${tableName}-generic-form-input-${inputFields[0]}`);
                                    firstInput.focus();
                                }
                            }}
                        >
                            Submit
                        </Button>
                    </Col>
                </Row>
                {dataLength > 0 ?
                    <Accordion.Collapse eventKey="0" style={{backgroundColor: 'transparent'}} className="generic-form-collapse">
                        {children}
                    </Accordion.Collapse>
                    :
                    <div>
                        <p style={{
                            fontFamily: 'Bestie'
                            , textAlign: 'center'
                            , fontSize: '30px'
                            , color: 'gray'

                        }}>
                            No entries found.
                        </p>
                        <br/>
                    </div>
                }
            </Accordion.Item>
        </Accordion>
    )

}