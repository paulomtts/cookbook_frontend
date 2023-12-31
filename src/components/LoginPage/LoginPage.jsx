/* Foreign dependencies */
import React from 'react';
import { Image } from 'react-bootstrap';

/* Local dependencies */
import { useData, api } from '../../core/dataContext';
import { useOverlay } from '../../core/overlayContext';

import backgroundImage from '/src/assets/loginBackground.png';
import googleButtonImage from '/src/assets/web_neutral_sq_ctn.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginPage.css';

export default function LoginPage() {

    const dataContext = useData();
    const overlayContext = useOverlay();
    

    const login = async () => {  
        overlayContext.show();
        const { response, content } = await dataContext.customRoute(api.auth.login, {method: 'GET', credentials: 'include'}, false, false);

        if (response.ok) {
           window.location.href = content.url;
        }
    }

    return (
        <div className="LoginPage text">
            <Image src={backgroundImage} className="image" fluid />
            <div className='overlay' />

            <div className='content'>
                <p className='title'>The Cookbook<span style={{
                    fontFamily: 'Arial',
                    fontWeight: '100',
                    fontSize: '0.75rem',
                    color: 'white',
                }}>alpha</span></p>
                <p className='text'>Share amazing recipes!</p>
                <br/>
                <br/>

                <Image 
                    className="GoogleButton" 
                    src={googleButtonImage}
                    title='Click to login with Google'
                    onClick={login}
                />

            </div>
            

        </div>
    );
}
