/* Foreign dependencies */
import React, { useEffect, useState } from "react";
import { Form, Image } from "react-bootstrap";

/* Local dependencies */
import { useDataFetcher } from "../../hooks/useDataFetcher";
import ComboBox from "../ComboBox/ComboBox";

export default function Home({
    imgSrc = ''
}) {

    const [recipeData, setRecipeData] = useDataFetcher('recipes');

    
    return (<>
        <Form className='GenericForm' style={{margin: '0.625rem'}}>
    
            <Image className={`GenericForm-image`} src={imgSrc} />
            <h2 className={`GenericForm-title`}>
                My Recipes
            </h2>

            <div className="flex vertical gap-3" style={{padding: '0.625rem'}}>
                <span className={`GenericForm-description`}>
                    Here you can find all the recipes you have created! More features are upcoming!
                </span>
                <ComboBox
                    tableContainerClassName={`RecipeForm-recipe-table`}
                    pattern='^([a-zA-Z0-9]{1,})$'
                    avoid={['id', 'id_recipe_ingredient', 'id_recipe', 'id_ingredient', 'id_unit', 'created_at', 'updated_at', 'created_by', 'updated_by']}
                    footer
                    
                    data={recipeData}
                />
            </div>
        </Form>
    </>)
}