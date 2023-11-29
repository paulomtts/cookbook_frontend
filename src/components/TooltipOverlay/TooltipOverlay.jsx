import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';



export default function TooltipOverlay({ 
    children
    , content
    , placement 
    , defaultShow
}) {
    
    useEffect(() => {
        if (localStorage.getItem('tutorial-mode') === null) {
            localStorage.setItem('tutorial-mode', true);
            setTutorialMode(true);
        } else {
            setTutorialMode(localStorage.getItem('tutorial-mode') === 'true');
        }
    }, []);
 
    const [tutorialMode, setTutorialMode] = useState(true);

    return (
        <OverlayTrigger
            // show={false}
            placement={placement}
            defaultShow={defaultShow ? tutorialMode: false}
            trigger={tutorialMode ? ['hover', 'focus'] : []}
            overlay={
                <Tooltip id={`tooltip-${placement}`}
                    style={{
                        transition: 'opacity 0.2s ease-in-out'
                    }}
                    onClick={() => {
                        localStorage.setItem('tutorial-mode', false);
                        setTutorialMode(false);
                    }}
                >
                    {content}
                </Tooltip>
            }
        >
            <div>
                {children}
            </div>
        </OverlayTrigger>
    );
}