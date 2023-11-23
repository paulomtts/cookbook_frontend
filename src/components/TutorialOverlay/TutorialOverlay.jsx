import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';



export default function Overlay({ children, text, placement }) {
    
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
            placement={placement}
            defaultShow={tutorialMode}
            overlay={
                <Tooltip id={`tooltip-${placement}`}
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.5) !important',
                        transition: 'opacity 0.125s ease-in-out'
                    }}
                    onClick={() => {
                        localStorage.setItem('tutorial-mode', false);
                        setTutorialMode(false);
                    }}
                >
                    {text}
                </Tooltip>
            }
            trigger={tutorialMode ? ['hover', 'focus'] : []}
        >
            <div>
                {children}
            </div>
        </OverlayTrigger>
    );
}