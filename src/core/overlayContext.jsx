/* Foreign dependencies */
import React, { useState, useContext, createContext } from 'react';
import { Spinner } from 'react-bootstrap';


const OverlayContext = createContext();

export function OverlayProvider({ children }) {

    const [enabled, setEnabled] = useState(false)
    const [opacity, setOpacity] = useState(0.5)

    const style = {
        position: 'fixed',
        top: '0',
        left: '25%',
        width: '100%',
        height: '100%',
        backgroundColor: `rgba(0,0,0,${opacity})`,
        display: enabled ? 'block' : 'none',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
    };

    const show = (opacity = null) => {
        if (opacity) {
            setOpacity(opacity);
        }
        if (!enabled) {
            setEnabled(true);
        }
    };

    const hide = (timeoutLength = 250) => {
        setTimeout(() => {
            setEnabled(false);
            setOpacity(0.5);
        }, timeoutLength);
    };

    return (
        <div>
            <OverlayContext.Provider value={{ show, hide }}>
                <div style={style}>
                    <Spinner variant='primary' animation="border" role="status" style={{ position: 'absolute', top: '50%', left: '37.5%' }} />
                </div>
                {children}
            </OverlayContext.Provider>
            
        </div>
    );
}

export const useOverlay = () => {
    return useContext(OverlayContext);
};