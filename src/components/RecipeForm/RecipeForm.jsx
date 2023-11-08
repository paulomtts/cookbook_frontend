/* Foreign dependencies */
import React, { useState, useEffect } from "react";

/* Local dependencies */
import { useDataFetcher } from "../../hooks/useDataFetcher";
import { useData } from "../../core/dataContext";


export function RecipeForm({
    children
}) {
    const dataContext = useData();
  
    const [recipeData, setRecipeData] = useDataFetcher("recipe");

    const [ingredientData, setIngredientData] = useDataFetcher("recipe_composition_initial");
    const [ingredientSelectedRows, setIngredientSelectedRows] = useState([]);
    const [ingredientQuantitiesData, setIngredientQuantitiesData] = useState({});

    /* Hooks */
    useEffect(() => {
        console.log('ingredientData', ingredientData);
    }, [ingredientData]);

    useEffect(() => {
        console.log('ingredientSelectedRows', ingredientSelectedRows);
    }, [ingredientSelectedRows]);

    useEffect(() => {
        console.log('ingredientQuantitiesData', ingredientQuantitiesData);
    }, [ingredientQuantitiesData]);

    /* Events */
    const onClickRecipeRow = async (row) => {
        const { json } = await dataContext.fetchData("recipe_composition_loaded", {}, {"id_recipe": row[`id`]});
        const newIngredientData = await JSON.parse(json.data);

        setIngredientData(newIngredientData);

        const newIngredientSelectedRows = [];
        const newIngredientQuantitiesData = {};

        newIngredientData.forEach((row) => {
            newIngredientSelectedRows.push(row);
            newIngredientQuantitiesData[row[`id`]] = row[`quantity`];
        });

        setIngredientSelectedRows(newIngredientSelectedRows);
        setIngredientQuantitiesData(newIngredientQuantitiesData);
        // we need to add a triggerSelectedRows to the ComboBox component
    }

    const onClickIngredientRow = (row) => {
        if(ingredientSelectedRows.includes(row)) {
            setIngredientSelectedRows(ingredientSelectedRows.filter(selRow => selRow !== row));
            onChangeIngredientQuantity(row, 0);
        } else {
            setIngredientSelectedRows([...ingredientSelectedRows, row]);
            onChangeIngredientQuantity(row, 1);
        }
    }

    const onChangeIngredientQuantity = (row, value) => {
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
   
        const name = child.props.dynamicName??null;
        if(name === null) return child;

        let props = {};
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
    });

    const value = {}

    return(<>
        <div className="form-container">
            {childrenWithProps}
        </div>
    </>);
}