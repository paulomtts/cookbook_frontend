import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';



export default function TooltipOverlay({ 
    children
    , content
    , placement 
    , defaultShow = false
}) {
    
    useEffect(() => {
        if (localStorage.getItem('tutorial-mode') === null) {
            localStorage.setItem('tutorial-mode', true);
            setTutorialMode(true);
        } else if (localStorage.getItem('tutorial-mode') === 'true') {
            setTutorialMode(localStorage.getItem('tutorial-mode') === 'true');
        } else {
            setTutorialMode(false);
        }
    }, []);
 
    const [tutorialMode, setTutorialMode] = useState(true);

    return (
        <OverlayTrigger
            placement={placement}
            defaultShow={defaultShow}
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