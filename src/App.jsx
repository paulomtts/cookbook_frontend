/* Foreign dependencies */
import React, { useState } from "react";

/* Local dependencies */
import FloatingMenu from "./components/FloatingMenu/FloatingMenu";
import GenericForm from "./components/GenericForm";
import Select from "./components/Select";
import RecipeForm from "./components/RecipeForm/RecipeForm";


export default function App() {   
    const elements = {
        'registry':
            <div>
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
            </div>,
        'recipes':
            <RecipeForm />

    }

    const [content, setContent] = useState(elements['registry'])
    const [isContentMounted, setIsContentMounted] = useState(true)

    const handleContentChange = (key) => {
        // if(key === content) return;
        setIsContentMounted(false);
        setContent(elements[key]);
    }

    return (<>
        <FloatingMenu onClickButton={handleContentChange}/>
        <div className={`content-container ${isContentMounted ? 'entering' : 'exiting'}`}>
            {content}
        </div>
    </>)
}