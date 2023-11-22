/* Foreign dependencies */
import React, { useState, useContext, createContext, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';


const NotificationContext = createContext();

export function NotificationProvider({ children }) {

    const delay = 2000;
    const [notification, setNotification] = useState([])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (notification.length > 0) {
                removeNotification();
            }
        }, delay);
    
        return () => clearTimeout(timer);
      }, [notification]);

    function removeNotification() {
        setNotification(notification.slice(1))
    }

    function spawnToast({title, message, variant, Component = null}) {
        const id = uuidv4();


        setNotification([
            ...notification,
            <ToastContainer className='notification-toast-container' key={id}>
                <Toast 
                    id={id}
                    show={true}
                    bg={variant}
                    onClose={removeNotification}
                >
                    <Toast.Header 
                        style={{
                            display: 'flex'
                            , justifyContent: 'space-between'
                        }} 
                        closeButton={true}
                    >
                        <strong>{title}</strong>
                    </Toast.Header>
                    <Toast.Body
                        className='bg-light'
                        style={{
                            borderBottomRightRadius: '7px'
                            , borderBottomLeftRadius: '7px'
                        }}
                    >
                        {message}
                        {Component}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        ])
    }
    
    return (
        <NotificationContext.Provider value={{ notification, spawnToast }}>
            {children}
            <div className='notification-container'>
                {...notification}
            </div>
        </NotificationContext.Provider>
    );
}

export const useNotification = () => {
    return useContext(NotificationContext);
};