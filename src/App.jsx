/* Foreign dependencies */
import React, { useEffect, useState } from "react";

/* Local dependencies */
import Navbar from "./components/Navbar/Navbar";
import GenericForm from "./components/GenericForm/GenericForm";
import RecipeForm from "./components/RecipeForm/RecipeForm";
import Select from "./components/Select";
import { useConfigs } from "./core/configsContext";

export default function App() {

    const { maps } = useConfigs();
    const [fields, setFields] = useState({});
    const [content, setContent] = useState('recipes');

    useEffect(() => {
        if (Object.keys(maps).length === 0) return;
        setFields(maps.forms.fields);
    }, [maps]);
    
    const handleNavigationComponentClick = (key) => {
        setContent(key);
    }

    return (<>
        <div className="main-container">
            <Navbar onClickItem={handleNavigationComponentClick} imgSrc="./src/assets/recipes.avif"/>
            <div className={`content-container fade-in-long`}>
                {content === 'registry' && <>
                
                    <GenericForm
                        title='ingredients' 
                        tableName='ingredients'
                        fields={fields['ingredients']}
                        customInputs={{
                            'type': <Select tableName='categories' filters={{'and': {'type': ["ingredient"]}}} targetField="name"/>
                        }}
                        imgSrc="./src/assets/ingredients.avif"
                    />

                    <GenericForm
                        title='categories'
                        tableName='categories'
                        fields={fields['categories']}
                        customInputs={{
                            'type':<Select customOptions={['ingredient', 'period', 'recipe', 'presentation']}/>
                        }}
                        imgSrc="./src/assets/categories.jpg"
                    />

                    <GenericForm
                        title='units'
                        tableName='units'
                        fields={fields['units']}
                        imgSrc="./src/assets/units.jpg"
                    />
                </>}

                {content === 'recipes' && <>
                    <RecipeForm imgSrc={"./src/assets/recipes.avif"}/>
                </>}
            </div>
        </div>
    </>)
}