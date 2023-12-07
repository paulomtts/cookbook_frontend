/* Foreign dependencies */
import React, { useEffect, useState } from "react";

/* Local dependencies */
import Navbar from "./components/Navbar/Navbar";
import GenericForm from "./components/GenericForm/GenericForm";
import RecipeForm from "./components/RecipeForm/RecipeForm";
import Select from "./components/Select";
import { useConfigs } from "./core/configsContext";
import { useDataFetcher } from "./hooks/useDataFetcher";

export default function App() {

    const { maps } = useConfigs();
    const [fields, setFields] = useState({});
    const [content, setContent] = useState('registry');

    const [ingredientsCategories] = useDataFetcher('categories', {'and_': {'type': ["ingredient"]}}, {}, false, true);
    const [categoriesTypes] = useDataFetcher('categories', {'and_': {'type': ["type"]}}, {}, false, true);

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
                            'type': <Select data={ingredientsCategories} targetField='name'/>
                        }}
                        imgSrc="./src/assets/ingredients.avif"
                    />

                    <GenericForm
                        title='categories'
                        tableName='categories'
                        fields={fields['categories']}
                        customInputs={{'type': <Select 
                                                    data={[
                                                        {'name': 'ingredient'},
                                                        {'name': 'period'},
                                                        {'name': 'recipe'},
                                                        {'name': 'presentation'}
                                                    ]}
                                                    targetField="name"
                                                />
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