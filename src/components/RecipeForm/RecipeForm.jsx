/* Foreign dependencies */
import React, { useState } from "react";
import { Button } from "react-bootstrap";

/* Local dependencies */
import { useForm } from "../../core/formContext";
import { useData } from "../../core/dataContext";
import { useDataFetcher } from "../../hooks/useDataFetcher";
import { useTrigger } from "../../hooks/useTrigger";
import ComboBox from "../ComboBox/ComboBox";



export default function RecipeForm() {

    /* Contexts */
    const formContext = useForm();
    const dataContext = useData();
  
    /* Data */
    const [recipeData, setRecipeData] = useDataFetcher("recipe");
    
    const [recipeIngredientData, setRecipeIngredientData] = useDataFetcher("recipe_composition_empty"); // initial state
    const [snapshotRecipeIngredientData, setSnapshotRecipeIngredientData] = useState([]); // snapshot of recipe_ingredient

    /* Quantities & Selected Rows */
    const [recipeIngredientQuantitiesData, setRecipeIngredientQuantitiesData] = useState({});
    const [recipeIngredientSelectedRows, setRecipeIngredientSelectedRows] = useState([]);


    /* Triggers */
    const [triggerRecipeLock, setTriggerRecipeLock] = useTrigger();
    const [triggerRecipeDisplay, setTriggerRecipeDisplay] = useTrigger();
    
    const [triggerIngredientLock, setTriggerIngredientLock] = useTrigger();
    const [triggerIngredientDisplay, setTriggerIngredientDisplay] = useTrigger();
    const [triggerIngredientSelectedRows, setTriggerIngredientSelectedRows] = useTrigger();
        

    /* Events */
    const onClickRecipeRow = async (_, row) => { // reason: ComboBox's onClickRow sends (selectedRows, row)

        const { json: snapshotData } = await dataContext.fetchData("recipe_composition_snapshot", {}, {"id_recipe": row[`id`]});
        setSnapshotRecipeIngredientData(snapshotData);
        
        const { json: loadedData } = await dataContext.fetchData("recipe_composition_loaded", {}, {"id_recipe": row[`id`]});       
        setRecipeIngredientData(loadedData);
        

        // Cleanup
        setRecipeIngredientQuantitiesData({});

        // Triggers
        setTriggerRecipeLock(true);
        setTriggerRecipeDisplay("selected");
        
        setTriggerIngredientSelectedRows(snapshotData);
        setTriggerIngredientDisplay("selected");
        setTriggerIngredientLock(true);
        
    }

    const onChangeIngredientQuantity = (newQuantitiesData, _) => { // reason: ComboBox's onChangeQuantity sends (quantitiesData, row)
        setRecipeIngredientQuantitiesData(newQuantitiesData);
    }

    const onClickIngredientRow = async (selectedRows, _) => { // reason: ComboBox's onClickRow sends (selectedRows, row)
        setRecipeIngredientSelectedRows(selectedRows);
    }


    const handleSaveClick = async () => {

        const consolidatedData = formContext.consolidateData(recipeIngredientSelectedRows, recipeIngredientQuantitiesData, 'id', 'quantity');
        // add unit consolidation here
        
        const consolidatedOperations = formContext.consolidateOperations(snapshotRecipeIngredientData, consolidatedData, 'id');
        const { insertRows, updateRows, deleteRows } = consolidatedOperations;

        const consolidatedInsertRows = formContext.consolidateColumns(insertRows, ['id', 'id_recipe_ingredient', 'description', 'name', 'unit', 'type']);
        console.log("consolidatedInsertRows", consolidatedInsertRows);
    }

    return(<>
        <ComboBox
            name="combo-1"
            pattern='^([a-zA-Z0-9]{1,})$'
            avoid={['id', 'id_recipe_ingredient', 'id_recipe', 'id_ingredient', 'id_unit', 'created_at', 'updated_at']}
            selectable
            single
            footer

            data={recipeData}
            onClickRow={onClickRecipeRow}
            lockTrigger={triggerRecipeLock}
            displayTrigger={triggerRecipeDisplay}
        />
        <ComboBox
            name="combo-2"
            pattern='^([a-zA-Z0-9]{1,})$'
            avoid={['id', 'id_recipe_ingredient', 'id_recipe', 'id_ingredient', 'id_unit', 'created_at', 'updated_at']}
            selectable
            footer
            quantities

            data={recipeIngredientData}
            onClickRow={onClickIngredientRow}
            onChangeQuantity={onChangeIngredientQuantity}
            lockTrigger={triggerIngredientLock}
            displayTrigger={triggerIngredientDisplay}
            selectedRowsTrigger={triggerIngredientSelectedRows}

        />
        <Button 
            variant="primary"
            onClick={handleSaveClick}
        >
            Consolidate
        </Button>
    </>);
}