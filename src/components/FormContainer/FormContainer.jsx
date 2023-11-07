/* Foreign dependencies */
import React, { createContext, useEffect, useState } from "react";

/* Local dependencies */
import { useDataFetcher } from "../../hooks/useDataFetcher";
import { ComboBox } from "../ComboBox/ComboBox";
import { useData } from "../../core/dataContext";


const FormContainerContext = createContext();
const { Provider } = FormContainerContext;

function FormContainer({
    children
}) {
    const dataContext = useData();
    
    const [recipeData, setRecipeData] = useDataFetcher("recipe");

    const [ingredientData, setIngredientData] = useDataFetcher("recipe_composition_initial");
    const [ingredientSelectedRows, setIngredientSelectedRows] = useState([]);
    const [ingredientQuantitiesData, setIngredientQuantitiesData] = useState({});


    useEffect(() => {
        console.log('ingredientSelectedRows', ingredientSelectedRows);
    }, [ingredientSelectedRows]);

    useEffect(() => {
        console.log('ingredientQuantitiesData', ingredientQuantitiesData);
    }, [ingredientQuantitiesData]);

    /* Events */
    const onClickRecipeRow = async (row) => {
        console.log('Clicked', {...row});
        const { json } = await dataContext.fetchData("recipe_composition_loaded", {});
        const newIngredientData = await JSON.parse(json.data);
        setIngredientData(newIngredientData);
    }


    const onClickIngredientRow = (row) => {
        // console.log('Clicked', {...row});
        if(ingredientSelectedRows.includes(row)) {
            setIngredientSelectedRows(ingredientSelectedRows.filter(selRow => selRow !== row));
            onChangeIngredientQuantity(row, 0);
        } else {
            setIngredientSelectedRows([...ingredientSelectedRows, row]);
            onChangeIngredientQuantity(row, 1);
        }
    }

    const onChangeIngredientQuantity = (row, value) => {
        // console.log('Changed', row, '-> value:', value);
        const newQuantitiesData = {...ingredientQuantitiesData};
        if(value > 0) {
            newQuantitiesData[row[`id`]] = value;
        } else {
            delete newQuantitiesData[row[`id`]];
        }
        setIngredientQuantitiesData(newQuantitiesData);
    }


    /* Property injection */
    const childrenWithProps = React.Children.map(children, (child) => {
        if (child.type === ComboBox) {
            let props = {};
            const name = child.props.name;

            if (name === "recipe") {
                props = {
                    data: recipeData,
                    onClickRow: onClickRecipeRow,
                };
            } else if (name === "recipe_composition") {
                props = {
                    data: ingredientData,
                    onClickRow: onClickIngredientRow,
                    onChangeQuantity: onChangeIngredientQuantity,
                };
            }

            return React.cloneElement(child, props);
        } else {
            return child;
        }
    });

    const value = {}

    return(<>
        <Provider value={value}>
            {childrenWithProps}
        </Provider>
    </>);
}

export { FormContainer, FormContainerContext };