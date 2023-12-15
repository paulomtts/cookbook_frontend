/* Foreign dependencies */
import React, { useEffect, useState } from "react";
import { faHome } from "@fortawesome/free-solid-svg-icons";

/* Local dependencies */
import { useConfigs } from "./core/configsContext";
import { useDataFetcher } from "./hooks/useDataFetcher";
import { useTrigger } from "./hooks/useTrigger";
import Sidebar from "./components/Sidebar/Sidebar";

import Profile from "./components/Profile/Profile";
import Recipe from "./components/RecipeWorkflow/Recipe";
import Home from "./components/Home/Home";


import ingredientsHeaderImage from '/src/assets/ingredients.avif';
import categoriesHeaderImage from '/src/assets/categories.jpg';
import unitsHeaderImage from '/src/assets/units.jpg';
import recipesHeaderImage from '/src/assets/recipes.avif';

import './components/GenericForm/GenericForm.css';


export default function App() {

    const [content, setContent] = useState('home');
    
    const handleNavigationComponentClick = (key) => {
        setContent(key);
    }

    return (<>
        <div className="flex">
            <Sidebar menus={[
                {label: 'Home', icon: faHome, key: 'home', submenus: [
                    {label: 'New recipe', key: 'new-recipe'},
                ]},
            ]} onClickMenuItem={handleNavigationComponentClick}/>

            <div className={`Content fade-in-long`}>
                {content === 'profile' && <>
                    <Profile />
                </>}

                {content === 'home' && <>
                    <Home imgSrc="/src/assets/ingredients.avif" />
                </>}

                {content === 'new-recipe' && <>
                    <Recipe imgSrc={recipesHeaderImage} onSubmit={(key) => handleNavigationComponentClick(key)}/>
                </>}

            </div>
        </div>
    </>)
}