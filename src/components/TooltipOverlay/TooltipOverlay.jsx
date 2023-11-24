import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';



export default function TooltipOverlay({ children, content, placement }) {
    
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
            defaultShow={tutorialMode}
            trigger={tutorialMode ? ['hover', 'focus'] : []}
            overlay={
                <Tooltip id={`tooltip-${placement}`}
                    style={{
                        transition: 'opacity 0.125s ease-in-out'
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