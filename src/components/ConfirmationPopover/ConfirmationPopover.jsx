/* Foreign dependencies */
import React, { useState, useRef } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

/* Local dependencies */
import FormButton from '../FormButton/FormButton';
import './ConfirmationPopover.css';


export default function ConfirmationPopover({ children, text, placement, onYes = () => {}, onNo = () => {} }) {
    const uuid = uuidv4();

    return (
        <OverlayTrigger
            container={this}
            placement={placement}
            trigger='click'
            rootClose
            overlay={
                <Popover id={`popover-${placement}-${uuid}`}>
                    <Popover.Header as="h3" className='ConfirmationPopover-header'>
                        Are you sure?
                    </Popover.Header>
                    <Popover.Body className='ConfirmationPopover-body'>
                        <div className='ConfirmationPopover-text-container'>
                            {text}
                        </div>
                        <div className='ConfirmationPopover-button-container'>
                            <FormButton
                                className='ConfirmationPopover-FormButton-outlined'
                                type='submit'
                                onClick={() => {
                                    document.body.click();
                                    onYes();
                                }}
                                >
                                Yes
                            </FormButton>
                            <FormButton
                                type='button'
                                onClick={() => {
                                    document.body.click();
                                    onNo();
                                }}
                            >
                                No
                            </FormButton>
                        </div>
                    </Popover.Body>
                </Popover>
            }
        >
            <div>
                {children}
            </div>
        </OverlayTrigger>
    );
}