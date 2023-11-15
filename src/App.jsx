/* Foreign dependencies */
import React, { useState } from "react";

/* Local dependencies */
import Navbar from "./components/Navbar/Navbar";
import GenericForm from "./components/GenericForm";
import RecipeForm from "./components/RecipeForm/RecipeForm";
import Select from "./components/Select";


export default function App() {   

    const getComponents = (key) => {
        switch(key) {
            case 'registry':
                return <div>
                    <GenericForm
                        id='ingredients-form'
                        title='ingredients' 
                        tableName='ingredient' 
                        inputFields={['name', 'description', 'type']}
                        customInputs={{
                            'type': 
                            <Select tableName='category' filters={{'and': {'type': ["'ingredient'"]}}}/>
                        }}
                        imgSrc="./src/assets/ingredients.avif"
                    />
                    <div className="text-divider-02"/>
                    <GenericForm
                        id='categories-form'
                        title='categories'
                        tableName='category'
                        inputFields={['name', 'type']}
                        customInputs={{'type':
                            <Select customOptions={['ingredient', 'period', 'recipe']}/>
                        }}
                        imgSrc="./src/assets/categories.jpg"
                    />
                    <div className="text-divider-02"/>
                    <GenericForm
                        id='units-form'
                        title='units'
                        tableName='unit'
                        inputFields={['name', 'abbreviation', 'base']}
                        imgSrc="./src/assets/units.jpg"
                    />
                </div>
            case 'recipes':
                return <RecipeForm />;
            default:
                return null;
        }
    }

    const [content, setContent] = useState(getComponents('registry'));

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