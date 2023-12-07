/* Foreign dependencies */
import React from 'react';
import { Image } from 'react-bootstrap';

/* Local dependencies */
import { useData, api } from '../../core/dataContext';
import { useOverlay } from '../../core/overlayContext';
import './LoginPage.css';

export default function LoginPage() {

    const dataContext = useData();
    const overlayContext = useOverlay();
    

    const login = async () => {  
        overlayContext.show();
        const { response, content } = await dataContext.customRoute(api.auth.login, {}, false, false);

        if (response.status === 200) {
           window.location.href = content.url;
        }
    }

    return (
        <div className="LoginPage text">
            <Image src="./src/assets/loginBackground.png" className="image" fluid />
            <div className='overlay' />

            <div className='content'>
                <p className='title'>The Cookbook</p>


                <Image 
                    className="GoogleButton" 
                    src="./src/assets/web_neutral_sq_ctn.svg" 
                    title='Click to login with Google'
                    onClick={login}
                />

                <p className='text'>Create and share amazing recipes!</p>
            </div>
            

        </div>
    );
}
