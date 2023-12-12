/* Foreign dependencies */
import React, { useEffect, useState } from "react";

/* Local dependencies */
import Navbar from "./components/Navbar/Navbar";
import GenericForm from "./components/GenericForm/GenericForm";
import RecipeForm from "./components/RecipeForm/RecipeForm";
import Select from "./components/Select";
import { useConfigs } from "./core/configsContext";
import { useDataFetcher } from "./hooks/useDataFetcher";
import { useTrigger } from "./hooks/useTrigger";

import ingredientsHeaderImage from '/src/assets/ingredients.avif';
import categoriesHeaderImage from '/src/assets/categories.jpg';
import unitsHeaderImage from '/src/assets/units.jpg';
import recipesHeaderImage from '/src/assets/recipes.avif';


export default function App() {

    const { maps } = useConfigs();
    const [fields, setFields] = useState({});
    const [content, setContent] = useState('recipes');

    const [ingCatTrigger, resetIngCatTrigger] = useTrigger(false);
    const [ingredientsCategories] = useDataFetcher('categories', {'and_': {'type': ["ingredient"]}}, [ingCatTrigger]);

    useEffect(() => {
        if (Object.keys(maps).length === 0) return;
        setFields(maps.forms.fields);
    }, [maps]);
    
    const handleNavigationComponentClick = (key) => {
        setContent(key);
    }

    return (<>
        <div className="main-container">
            <Navbar onClickItem={handleNavigationComponentClick} imgSrc="/src/assets/recipes.avif"/>
            <div className={`content-container fade-in-long`}>
                {content === 'registry' && <>
                
                    <GenericForm
                        title='ingredients' 
                        tableName='ingredients'
                        fields={fields['ingredients']}
                        customInputs={{
                            'type': <Select data={ingredientsCategories} showField='name' targetField='name'/>
                        }}
                        imgSrc={ingredientsHeaderImage}
                    />

                    <GenericForm
                        title='categories'
                        tableName='categories'
                        fields={fields['categories']}
                        customInputs={{
                            'type': <Select 
                                        data={[
                                            {'name': 'ingredient'},
                                            {'name': 'timing'},
                                            {'name': 'recipe'},
                                            {'name': 'course'}
                                        ]}
                                        targetField="name"
                                    />
                        }}
                        imgSrc={categoriesHeaderImage}
                        onSubmit={() => resetIngCatTrigger(true)}
                        onDelete={() => resetIngCatTrigger(true)}
                    />

                    <GenericForm
                        title='units'
                        tableName='units'
                        fields={fields['units']}
                        imgSrc={unitsHeaderImage}
                    />
                </>}

                {content === 'recipes' && <>
                    <RecipeForm imgSrc={recipesHeaderImage}/>
                </>}
            </div>
        </div>
    </>)
}