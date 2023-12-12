/* Foreign dependencies */
import React, { useState, useContext, createContext, useEffect } from 'react';

/* Local dependencies */
import { api } from './dataContext';
import { useOverlay } from './overlayContext';
import LoginPage from '../components/LoginPage/LoginPage';


const AuthContext = createContext();
const { Provider } = AuthContext;

export function AuthProvider({ children }) {

    const overlayContext = useOverlay();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const validateSession = async () => {
            const payload = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            }

            await fetch(api.auth.validate, payload)
            .then((response) => {
                console.log(response)
                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
                return response;
            })
            .catch(() => {});
        }


        try {
            overlayContext.show();
            validateSession();
        } catch (error) {
            console.log(error);
        } finally {
            overlayContext.hide();
        }
    }, []);


    return (
        <Provider value={{ isAuthenticated }}>
            {isAuthenticated ? children : <LoginPage />}
        </Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};