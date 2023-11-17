/* Foreign dependencies */
import React, { useState } from "react";

/* Local dependencies */
import Navbar from "./components/Navbar/Navbar";
import GenericForm from "./components/GenericForm/GenericForm";
import RecipeForm from "./components/RecipeForm/RecipeForm";
import Select from "./components/Select";
import DashboardButton from "./components/DashboardButton/DashboardButton";



export default function App() {   

    const getComponents = (key) => {
        switch(key) {
            case 'registry':
                return [
                        <GenericForm
                            key={'ingredients'}
                            title='ingredients' 
                            tableName='ingredients' 
                            customInputs={{
                                'type': 
                                <Select tableName='categories' filters={{'and': {'type': ["'ingredient'"]}}}/>
                            }}
                            imgSrc="./src/assets/ingredients.avif"
                        />
                        , <GenericForm
                            key={'categories'}
                            title='categories'
                            tableName='categories'
                            customInputs={{'type':
                                <Select customOptions={['ingredient', 'period', 'recipe']}/>
                            }}
                            imgSrc="./src/assets/categories.jpg"
                        />
                        , <GenericForm
                            key={'units'}
                            title='units'
                            tableName='units'
                            imgSrc="./src/assets/units.jpg"
                        />
                    
                ];
            case 'recipes':
                return ( 
                    <RecipeForm />
                );
            case 'dashboard':
                return (<>
                    <DashboardButton />
                </>);
            default:
                return null;
        }
    }

    const [content, setContent] = useState(getComponents('dashboard'));

    const handleNavigationComponentClick = (key) => {
        setContent(getComponents(key));
    }

    return (<>
        <div className="main-container">
            <Navbar onClickItem={handleNavigationComponentClick}/>
            <div className={`content-container fade-in-long`}>
                {content}
            </div>
        </div>
    </>)
}