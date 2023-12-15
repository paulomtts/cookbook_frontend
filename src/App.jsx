/* Foreign dependencies */
import React, { useEffect, useState } from "react";
import { faHome } from "@fortawesome/free-solid-svg-icons";

/* Local dependencies */
import { useConfigs } from "./core/configsContext";
import { useDataFetcher } from "./hooks/useDataFetcher";
import { useTrigger } from "./hooks/useTrigger";
import Sidebar from "./components/Sidebar/Sidebar";
import GenericForm from "./components/GenericForm/GenericForm";
import RecipeForm from "./components/RecipeForm/RecipeForm";
import Select from "./components/Select";
import Profile from "./components/Profile/Profile";
import Recipe from "./components/RecipeWorkflow/Recipe";


import ingredientsHeaderImage from '/src/assets/ingredients.avif';
import categoriesHeaderImage from '/src/assets/categories.jpg';
import unitsHeaderImage from '/src/assets/units.jpg';
import recipesHeaderImage from '/src/assets/recipes.avif';


export default function App() {

    const { maps } = useConfigs();
    const [fields, setFields] = useState({});
    const [content, setContent] = useState('recipes');

    const [ingredientCategoriesTrigger, resetIngredientCategoriesTrigger] = useTrigger(false);
    const [ingredientsCategories] = useDataFetcher('categories', {'and_': {'type': ["ingredient"]}}, [ingredientCategoriesTrigger]);

    useEffect(() => {
        if (Object.keys(maps).length === 0) return;
        setFields(maps.forms.fields);
    }, [maps]);
    
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

                {content === 'new-recipe' && <>
                    <Recipe imgSrc={recipesHeaderImage} onSubmit={(key) => handleNavigationComponentClick(key)}/>
                </>}

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
                        onSubmit={() => resetIngredientCategoriesTrigger(true)}
                        onDelete={() => resetIngredientCategoriesTrigger(true)}
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